import { User } from "@prisma/client";

const getUserWithoutPassword = async (currentUser: User) => {
  const { password, ...user } = currentUser;
  return user;
};

export default { getUserWithoutPassword };
