import {
  Resident,
  User,
  BillTypeConfiguration,
  BillType,
} from "@prisma/client";
import prisma from "@lib/prisma";
import getPrisma from "@lib/getPrisma";

const create = async (user: User) => {
  return await prisma.user.create({
    data: user,
  });
};

const updateOnBoardDetails = async (
  db: ReturnType<typeof getPrisma>,
  id: string,
  updatedData: User,
  residentialData: Resident
) => {
  return await db.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: {
        id,
      },
      data: {
        ...updatedData,
        hasOnboarded: true,
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
  updateOnBoardDetails,
};
