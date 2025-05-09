import { FC } from "react";
import dayjs from "dayjs";

const UserReport: FC = () => {
  const today = dayjs();
  const reportMonths = Array.from({ length: 3 }, (_, i) =>
    today.add(-i, "month")
  );

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <span className="text-gray-600 font-semibold mb-6">Generate Report</span>

      {reportMonths.map((date) => (
        <div
          key={date.month()}
          className="w-full flex items-center border-2 border-primary h-20 rounded-md p-2 gap-1"
        >
          <span className=" text-primary font-medium w-4/12 text-center">
            {date.format("MMM")}
          </span>
          <button className="w-4/12 p-2 border-2 border-accent rounded-md text-gray-600 text-sm">
            Residents
          </button>
          <button className="w-4/12 p-2 border-2 border-accent rounded-md text-gray-600 text-sm">
            Outsiders
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserReport;
