import { User } from "@prisma/client";
import getPrisma from "../lib/getPrisma";

const getUserWithoutPassword = async (currentUser: User) => {
  const { password, ...user } = currentUser;
  return user;
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

export default { getUserWithoutPassword, getFullUserDetails };
