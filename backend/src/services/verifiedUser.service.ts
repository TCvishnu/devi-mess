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
export default { updateUserNameAndFoodPreference };
