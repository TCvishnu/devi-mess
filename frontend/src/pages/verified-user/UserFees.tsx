import { FC, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { MealType, UserRole } from "@type/enums";
import { ResidentFeesType } from "@type/user";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuthContext } from "@contexts/AuthContext";

type MessCut = {
  date: Dayjs;
  cutType: MealType;
};

const today = dayjs();
const prevMonth = today.subtract(1, "month");
const daysInPreviousMonth = prevMonth.daysInMonth();
const totalFees = daysInPreviousMonth * 160;

// from backend and gender wise
const cutToCostMap = {
  FULL: 160,
  EVENING: 60,
  MORNING: 50,
  AFTERNOON: 40,
};

const UserFees: FC = () => {
  const { user } = useAuthContext();

  const userRole: UserRole = user?.role || UserRole.Admin;

  //ignore type issues; to be removed
  const AprMessCuts: MessCut[] = [
    { date: dayjs("2025-03-10"), cutType: "FULL" },
    { date: dayjs("2025-03-11"), cutType: "MORNING" },
    { date: dayjs("2025-03-21"), cutType: "FULL" },
    { date: dayjs("2025-03-24"), cutType: "EVENING" },
  ];

  const residentialFees: ResidentFeesType = {
    rent: 3100,
    wifi: 0,
    electricity: 0,
    totalFees: 3100,
  };

  const finalFees = AprMessCuts.reduce(
    (fees, cutDate) => fees - cutToCostMap[cutDate.cutType],
    totalFees
  );

  const cutDetails = AprMessCuts.reduce(
    (counter, cutDate) => {
      return {
        ...counter,
        [cutDate.cutType]: counter[cutDate.cutType] + 1,
      };
    },
    {
      FULL: 0,
      MORNING: 0,
      EVENING: 0,
      AFTERNOON: 0,
    }
  );

  return (
    <div className="py-6 w-full max-w-md mx-auto flex flex-col gap-4">
      <div
        className="w-full border border-gray-300 rounded-lg p-6 shadow-sm 
        flex flex-col justify-start"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Icon icon="icon-park-outline:calendar" className=" size-6 " />
            Mess Fees
          </h2>
          <span className="text-primary font-semibold">
            {prevMonth.format("MMMM, YYYY")}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600 mb-2 border-b pb-2">
          <span>Total Days</span>
          <span>{daysInPreviousMonth} days</span>
        </div>

        <div className="flex justify-between text-base font-medium text-gray-700 my-2">
          <span>Days Attended</span>
          <span>{daysInPreviousMonth - AprMessCuts.length} days</span>
        </div>

        <div className="flex justify-between items-center mt-4 text-lg font-semibold text-primary">
          <span className="flex items-center gap-1">Final Fees</span>
          <span className="text-accent font-black flex items-center">
            <Icon icon="mdi:currency-inr" className=" size-5 " />
            {finalFees}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600 mt-4 border-b"></div>
        <div className="w-full mt-4 flex flex-col gap-1 font-medium text-gray-500">
          <div className="w-full flex justify-between">
            <span>Full day cuts:</span>
            <span>{cutDetails.FULL}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>Morning cuts:</span>
            <span>{cutDetails.MORNING}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>Afternoon cuts:</span>
            <span>{cutDetails.AFTERNOON}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>Evening cuts:</span>
            <span>{cutDetails.EVENING}</span>
          </div>
        </div>
      </div>

      {userRole === UserRole.Resident && (
        <div
          className="w-full border border-gray-300 rounded-lg p-6 shadow-sm 
        flex flex-col justify-start"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Icon icon="healthicons:home-outline" className="size-8" />
              Hostel Fees
            </h2>
            <span className="text-primary font-semibold">
              {prevMonth.format("MMMM, YYYY")}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Room Rent</span>
            <span>{residentialFees.rent}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 pb-2">
            <span>Electricity Bill</span>
            <span>{residentialFees.electricity || "--"}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 pb-2 border-b">
            <span>Wifi Charges</span>
            <span>{residentialFees.wifi || "--"}</span>
          </div>

          <div className="flex justify-between items-center mt-4 text-lg font-semibold text-primary">
            <span className="flex items-center gap-1">Final Fees</span>
            <span className="text-accent font-black flex items-center">
              <Icon icon="mdi:currency-inr" className=" size-5 " />
              {residentialFees.totalFees}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFees;
