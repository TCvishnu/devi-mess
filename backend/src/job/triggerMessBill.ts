import prisma from "@lib/prisma";
import { makeWorkerUtils } from "graphile-worker";

const tryRunningTriggerMessBillJob = async () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const log = await prisma.jobHistory.findFirst({
    where: { task: "triggerMessBill" },
  });

  const alreadyRanThisMonth =
    log && log.month === currentMonth && log.year === currentYear;

  if (alreadyRanThisMonth) {
    console.log("Bills already calculated this month.");
    return;
  }

  console.log("Running triggerMessBill for this month...");

  const workerUtils = await makeWorkerUtils({
    connectionString: process.env.DATABASE_URL!,
  });

  await workerUtils.addJob("triggerMessBill", {});

  await prisma.jobHistory.upsert({
    where: { task: "triggerMessBill" },
    update: { month: currentMonth, year: currentYear },
    create: {
      task: "triggerMessBill",
      month: currentMonth,
      year: currentYear,
    },
  });
};

export default tryRunningTriggerMessBillJob;
