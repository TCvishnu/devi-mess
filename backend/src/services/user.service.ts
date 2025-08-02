import {
  Resident,
  User,
  BillTypeConfiguration,
  BillType,
  MealType,
  Gender,
} from "@prisma/client";
import prisma from "@lib/prisma";
import getPrisma from "@lib/getPrisma";
import { hashPassword } from "@utils/bcrypt.util";

const selectFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  phoneNumber: true,
  gender: true,
  mealType: true,
  role: true,
  isVeg: true,
  hasOnboarded: true,
  adminVerified: true,
};

const create = async (db: ReturnType<typeof getPrisma>, user: User) => {
  return await db.user.create({
    data: user,
  });
};

const onboardStudent = async (
  db: ReturnType<typeof getPrisma>,
  updatedData: User,
  residentialData: Resident
) => {
  return await db.$transaction(async (tx) => {
    const updatedUser = await tx.user.create({
      data: {
        ...updatedData,
        hasOnboarded: true,
        adminVerified: true,
        startDate: new Date(updatedData.startDate!),
      },
    });
    console.log(updatedUser);
    let savedResidentialData: Resident | null = null;

    if (residentialData) {
      const newResidentialData = residentialData as Pick<
        Resident,
        "floor" | "building"
      >;

      savedResidentialData = await tx.resident.create({
        data: {
          userId: updatedUser.id,
          floor: newResidentialData.floor,
          building: newResidentialData.building,
        },
      });
    }
    const { password, ...safeUser } = updatedUser;
    const { gender, mealType } = safeUser;
    if (!gender || !mealType) {
      return { ...safeUser, residentialData: savedResidentialData };
    }

    const buildingClassifier =
      savedResidentialData &&
      `${savedResidentialData.building} ${savedResidentialData.floor}`;

    const conditions: any[] = [];

    const genderCondition: any = { classifier: gender };
    if (mealType !== "FULL_MEAL") {
      genderCondition.type = mealType as BillType;
    }
    conditions.push(genderCondition);

    if (buildingClassifier) {
      conditions.push({ classifier: buildingClassifier });
      conditions.push({ classifier: "RESIDENT" });
    }

    const applicableConfigs = await tx.billTypeConfiguration.findMany({
      where: {
        OR: conditions,
      },
    });

    const insertData = applicableConfigs.map(
      (config: BillTypeConfiguration) => ({
        userId: safeUser.id,
        billTypeConfigurationId: config.id,
        overriddenAmount: 0,
      })
    );

    console.log("here2", insertData);

    await tx.userBillTypeConfiguration.createMany({ data: insertData });
    return { ...safeUser, residentialData: savedResidentialData };
  });
};

const getFullUserDetails = async (
  db: ReturnType<typeof getPrisma>,
  userID: string
) => {
  const user = await db.user.findUnique({
    where: { id: userID },
    include: { residentialData: true },
  });

  if (!user) return null;

  const { password, ...rest } = user;
  return rest;
};

const findById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const findByIdAndUpdate = async (
  db: ReturnType<typeof getPrisma>,
  id: string,
  updatedData: Partial<User>
) => {
  return await db.user.update({
    where: {
      id,
    },
    data: updatedData,
  });
};

const findByPhoneNumber = async (phoneNumber: string) => {
  return await prisma.user.findUnique({
    where: {
      phoneNumber,
    },
  });
};

const findNotVerifiedUsers = async (
  db: ReturnType<typeof getPrisma>,
  page: number,
  limit: number,
  query?: Omit<Partial<User>, "password">
) => {
  const skip = (page - 1) * 5;
  const take = 5;

  const whereClause: { [key: string]: any } = {
    adminVerified: false,
    hasOnboarded: true,
  };

  if (query?.name) {
    whereClause.name = {
      contains: query.name,
      mode: "insensitive",
    };
  }

  const totalUsers = await db.user.count({
    where: whereClause,
  });

  const result = await db.user.findMany({
    where: whereClause,
    select: selectFields,
    orderBy: {
      updatedAt: "desc",
    },
    skip,
    take,
  });

  return {
    pagination: {
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    },
    result,
  };
};

const deleteUser = async (db: ReturnType<typeof getPrisma>, userID: string) => {
  await db.user.delete({ where: { id: userID } }); // onDelete Cascade
};

const updateMealType = async (
  db: ReturnType<typeof getPrisma>,
  userID: string,
  mealType: MealType,
  gender: Gender
) => {
  await db.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userID }, data: { mealType } });
    await tx.userBillTypeConfiguration.deleteMany({
      where: {
        billTypeConfiguration: {
          type: {
            in: [
              BillType.MORNING_MEAL,
              BillType.AFTERNOON_MEAL,
              BillType.EVENING_MEAL,
              BillType.FULL_MEAL,
            ],
          },
        },
      },
    });

    if (mealType === MealType.FULL_MEAL) {
      const typesToInsert = [
        BillType.MORNING_MEAL,
        BillType.AFTERNOON_MEAL,
        BillType.EVENING_MEAL,
      ];

      const billTypeConfigs = await tx.billTypeConfiguration.findMany({
        where: {
          type: { in: typesToInsert },
          classifier: gender,
        },
      });
      for (const config of billTypeConfigs) {
        await tx.userBillTypeConfiguration.create({
          data: {
            userId: userID,
            billTypeConfigurationId: config.id,
            overriddenAmount: 0,
          },
        });
      }
    } else {
      const billTypeConfig = await tx.billTypeConfiguration.findFirst({
        where: { type: mealType, classifier: gender },
      });
      if (!billTypeConfig) {
        throw new Error("BillTypeConfiguration not found");
      }

      await tx.userBillTypeConfiguration.create({
        data: {
          userId: userID,
          billTypeConfigurationId: billTypeConfig.id,
          overriddenAmount: 0,
        },
      });
    }
  });
};

const updatePassword = async (
  db: ReturnType<typeof getPrisma>,
  userID: string,
  password: string
) => {
  const hashedPassword = await hashPassword(password);

  return await db.user.update({
    where: { id: userID },
    data: { password: hashedPassword },
  });
};

// const findBy = async (id: string): Promise<User | null> => {
// 	return await prisma.user.findUnique({
// 		where: {
// 			id,
// 		},
// 	})
// }

export default {
  create,
  findById,
  getFullUserDetails,
  findByPhoneNumber,
  findByIdAndUpdate,
  findNotVerifiedUsers,
  deleteUser,
  updateMealType,
  updatePassword,
  onboardStudent,
};
