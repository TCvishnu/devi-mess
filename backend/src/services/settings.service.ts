import getPrisma from "../lib/getPrisma";

const getSettingsConfiguration = async (db: ReturnType<typeof getPrisma>) => {
  return await db.billTypeConfiguration.findMany();
};

export default { getSettingsConfiguration };
