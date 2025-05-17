import { FC } from "react";
import dayjs from "dayjs";

const UserReport: FC = () => {
  const today = dayjs();
  const reportMonths = Array.from({ length: 3 }, (_, i) =>
    today.subtract(i + 1, "month")
  );

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-6">
      {reportMonths.map((date) => (
        <div
          key={date.format("YYYY-MM")}
          className="w-full rounded-sm border border-gray-300 shadow-sm"
        >
          <div className="p-6 flex flex-col gap-4 items-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-primary tracking-wide">
                {date.format("MMMM")}
              </h2>
              <p className="text-sm font-medium text-gray-400">
                {date.format("YYYY")}
              </p>
            </div>

            <div className="flex w-full">
              <button className="w-1/2 p-3 text-sm font-medium text-primary border-r border-accent">
                Residents
              </button>
              <button className="w-1/2 p-3 text-sm font-medium text-accent">
                Outsiders
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserReport;
