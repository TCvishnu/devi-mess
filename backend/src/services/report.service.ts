import prisma from "@lib/prisma";
import {
  BillComponents,
  BillType,
  Report,
  ReportType,
  UserRole,
} from "@prisma/client";
import { saveExcelFile } from "@utils/file.util";
import ExcelJS from "exceljs";
import { MessReportRows, ResidentReportRows } from "../types/excel";
import { EXCEL_COLUMNS } from "../config/excelConfig";
import getPrisma from "@lib/getPrisma";

const generateReport = async (
  db: ReturnType<typeof getPrisma>,
  month: number,
  year: number,
  reportType: ReportType
): Promise<Report | null> => {
  const alreadyExistingReport = await db.report.findFirst({
    where: {
      month,
      year,
      type: reportType,
    },
  });

  if (alreadyExistingReport) {
    console.log(alreadyExistingReport);
    return alreadyExistingReport;
  }

  const reportEligibleLastDate = new Date();

  reportEligibleLastDate.setFullYear(month == 11 ? year + 1 : year);
  reportEligibleLastDate.setMonth(month == 11 ? 0 : month + 1);
  reportEligibleLastDate.setDate(1);
  reportEligibleLastDate.setHours(0, 0, 0, 0);

  const users = await db.user.findMany({
    where: {
      role: reportType,
      hasOnboarded: true,
      startDate: {
        lt: reportEligibleLastDate,
      },
    },
    include: {
      userBills: {
        where: {
          month,
          year,
        },
        include: {
          billComponents: true,
        },
      },
    },
  });

  const workBook = new ExcelJS.Workbook();

  const workSheet = workBook.addWorksheet("Report");

  workSheet.columns = EXCEL_COLUMNS[reportType];

  const rows: ResidentReportRows[] | MessReportRows[] = [];

  users.forEach((user, index) => {
    let rowDetails: MessReportRows | ResidentReportRows = {
      id: index + 1,
      name: user.name,
      totalDays: 0,
      totalAmount: 0,
      mess: 0,
      rent: 0,
      wifi: 0,
      electricity: 0,
    };

    if (user.role === UserRole.RESIDENT) {
      const billMap = new Map<BillType, BillComponents>();

      user.userBills[0]?.billComponents.forEach((eachBill) => {
        billMap.set(eachBill.type, eachBill);
      });

      const electricityBill = billMap.get(BillType.ELECTRICITY);
      const rentBill = billMap.get(BillType.RENT);
      const wifiBill = billMap.get(BillType.WIFI);

      if (electricityBill) {
        rowDetails.electricity = electricityBill.amount;
        rowDetails.totalAmount += electricityBill.amount;
      }
      if (rentBill) {
        rowDetails.rent = rentBill.amount;
        rowDetails.totalAmount += rentBill.amount;
      }
      if (wifiBill) {
        rowDetails.wifi = wifiBill.amount;
        rowDetails.totalAmount += wifiBill.amount;
      }
    }

    const filterTypeMap = new Map();

    if (user.mealType === BillType.FULL_MEAL) {
      // mess bill is the cummulative of all noons for FULL_MEAL
      filterTypeMap.set(BillType.MORNING_MEAL, 1);
      filterTypeMap.set(BillType.AFTERNOON_MEAL, 1);
      filterTypeMap.set(BillType.EVENING_MEAL, 1);
    } else {
      filterTypeMap.set(user.mealType, 1);
    }

    const messBill = user.userBills[0]?.billComponents.filter((eachBill) =>
      filterTypeMap.has(eachBill.type)
    );

    if (messBill?.length > 0) {
      messBill.forEach((eachBill) => {
        rowDetails.totalDays =
          rowDetails.totalDays < eachBill.totalDays
            ? eachBill.totalDays
            : rowDetails.totalDays;

        rowDetails.totalAmount += eachBill.amount;
        rowDetails.mess += eachBill.amount;
      });
    }

    rows.push(rowDetails);
  });

  workSheet.addRows(rows);

  workSheet.getRow(1).eachCell((cell) => {
    (cell.font = { bold: true }),
      (cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFCC00" },
      });
  });

  const savedPath = await saveExcelFile(workBook);

  if (!savedPath) {
    console.error("Failed to save excel file");
    return null;
  }

  const savedReport = await db.report.create({
    data: {
      type: reportType,
      excelPath: savedPath,
      month,
      year,
    },
  });

  return savedReport;
};

// use for billConfigChange
const deleteReportByMonthAndYearAndType = async (
  db: ReturnType<typeof getPrisma>,
  month: number,
  year: number,
  type: ReportType
) => {
  return await db.report.deleteMany({
    where: {
      month,
      year,
      type,
    },
  });
};

export default {
  generateReport,
  deleteReportByMonthAndYearAndType,
};
