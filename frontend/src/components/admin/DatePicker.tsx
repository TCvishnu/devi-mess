import type { FC } from "react";
import { useDate } from "@contexts/DateContext";

import { Dayjs } from "dayjs";

type DatePickerType = {
  allowDateChanging: boolean;
};
const DatePicker: FC<DatePickerType> = ({ allowDateChanging }) => {
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
        {selectedDate.format("MMMM, YYYY")}
      </span>
      <div className="w-full flex justify-between">
        {displayDates.map((date) => (
          <button
            disabled={!allowDateChanging}
            onClick={() => changeSelectedDate(date)}
            className={`h-14 w-12 xs:h-16 xs:w-1/6 sm:h-20 flex flex-col items-center justify-center rounded-md disabled:active:animate-shake ${
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
