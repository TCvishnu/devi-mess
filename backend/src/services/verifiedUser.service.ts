import { UserRole } from "@prisma/client";
import getPrisma from "../lib/getPrisma";

const updateUserNameAndFoodPreference = async (
  db: ReturnType<typeof getPrisma>,
  newData: {
    name: string;
    isVeg: boolean;
  },
  userID: string
) => {
  const { password, ...updatedUser } = await db.user.update({
    where: {
      id: userID,
    },
    data: newData,
  });

  return updatedUser;
};

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
  residentialData: true,
};

const getResidents = async (db: ReturnType<typeof getPrisma>) => {
  const residents = await db.user.findMany({
    where: {
      adminVerified: true,
      role: UserRole.RESIDENT,
    },
    select: selectFields,
  });

  return residents;
};

const getMessStudents = async (db: ReturnType<typeof getPrisma>) => {
  const messStudents = await db.user.findMany({
    where: {
      adminVerified: true,
      role: UserRole.MESS,
    },
    select: selectFields,
  });

  return messStudents;
};

export default {
  updateUserNameAndFoodPreference,
  getResidents,
  getMessStudents,
};
