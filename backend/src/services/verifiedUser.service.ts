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
  residentialData: true,
};

const getResidents = async (
  db: ReturnType<typeof getPrisma>,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;
  const residents = await db.user.findMany({
    where: {
      role: UserRole.RESIDENT,
    },
    select: selectFields,
    skip,
    take: limit,
  });

  // redis cache?
  const total = await db.user.count({
    where: {
      role: UserRole.RESIDENT,
    },
  });

  return { residents, total };
};

const getMessStudents = async (
  db: ReturnType<typeof getPrisma>,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;
  const messStudents = await db.user.findMany({
    where: {
      role: UserRole.MESS,
    },
    select: selectFields,
    skip,
    take: limit,
  });

  const total = await db.user.count({
    where: {
      role: UserRole.MESS,
    },
  });

  return { messStudents, total };
};

const searchStudentsByName = async (
  db: ReturnType<typeof getPrisma>,
  name: string,
  role: UserRole
) => {
  const students = await db.user.findMany({
    where: {
      role,
      name: {
        startsWith: name,
        mode: "insensitive",
      },
    },
    select: selectFields,
  });

  return students;
};

export default {
  updateUserNameAndFoodPreference,
  getResidents,
  getMessStudents,
  searchStudentsByName,
};
