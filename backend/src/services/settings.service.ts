import getPrisma from "../lib/getPrisma";
import { BillTypeConfiguration } from "@prisma/client";

const getSettingsConfiguration = async (db: ReturnType<typeof getPrisma>) => {
  const rawConfig = db.billTypeConfiguration.findMany();

  return (await rawConfig).sort(
    (a: BillTypeConfiguration, b: BillTypeConfiguration) =>
      a.type.localeCompare(b.type)
  );
};

const updateFixedConfig = async (
  db: ReturnType<typeof getPrisma>,
  updateData: { id: string; amount: number }[]
) => {
  const results = await db.$transaction(async (tx) => {
    const ops = updateData.map(({ id, amount }) =>
      tx.billTypeConfiguration.update({
        where: { id },
        data: { amount },
      })
    );
    return Promise.all(ops);
  });

  return results.length;
};

export default { getSettingsConfiguration, updateFixedConfig };
