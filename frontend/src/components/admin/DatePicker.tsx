import type { FC } from "react";
import { useDate } from "@contexts/DateContext";

import { Dayjs } from "dayjs";

const DatePicker: FC = () => {
  const { selectedDate, setSelectedDate } = useDate();

  let displayDates = Array.from({ length: 5 }, (_, i) =>
    selectedDate.add(i - 2, "day")
  );

  const changeSelectedDate = (date: Dayjs) => {
    setSelectedDate(date);
  };

  return (
    <div className="w-full min-h-32 bg-white my-6 rounded-sm xs:min-h-36 flex flex-col gap-2 items-center px-4 justify-center">
      <span className="font-semibold text-primary text-lg">
        {selectedDate.format("MMM")}
      </span>
      <div className="w-full flex justify-between">
        {displayDates.map((date) => (
          <button
            onClick={() => changeSelectedDate(date)}
            className={`h-14 w-12 xs:h-16 xs:w-14 flex flex-col items-center justify-center rounded-md ${
              selectedDate.isSame(date, "day")
                ? " bg-accent text-white"
                : "border-gray-500 border text-gray-500"
            }`}
            key={date.format("YYYY-MM-DD")}
          >
            <span className="text-xs">{date.format("ddd")}</span>
            <span>{date.format("DD")}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DatePicker;
