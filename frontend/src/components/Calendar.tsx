import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Icon } from "@iconify/react/dist/iconify.js";

const daysOfWeek: String[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarProps = {
  messCuts: number[];
};

export default function Calendar({ messCuts }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [isSelectingCuts, setIsSelectingCuts] = useState<boolean>(false);
  const [newCutRange, setNewCutRange] = useState<
    [number | null, number | null]
  >([null, null]);

  const startOfMonth: Dayjs = currentMonth.startOf("month");
  const endOfMonth: Dayjs = currentMonth.endOf("month");

  const daysInMonth: number = endOfMonth.date();
  const startDayOfWeek: number = startOfMonth.day();

  const prevMonth: () => void = () =>
    setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth: () => void = () =>
    setCurrentMonth(currentMonth.add(1, "month"));

  const today: Dayjs = dayjs();

  const handleButtonClick = (day: number) => {
    if (!isSelectingCuts) return;

    const [start, end] = newCutRange;

    if (start === null || (start !== null && end !== null)) {
      setNewCutRange([day, null]);
    } else if (start !== null && end === null) {
      if (day === start) {
        setNewCutRange([day, day]);
      } else {
        const sortedRange = [start, day].sort((a, b) => a - b);
        setNewCutRange([sortedRange[0], sortedRange[1]]);
      }
    }
  };

  const handleNewCutsCancel: () => void = () => {
    setIsSelectingCuts(false);
    setNewCutRange([null, null]);
  };

  const generateCalendar = () => {
    const days = [];

    const totalCells: number =
      Math.ceil((startDayOfWeek + daysInMonth) / 7) * 7;

    for (let i: number = 0; i < totalCells; i++) {
      const day: number = i - startDayOfWeek + 1;

      const isCurrentMonth: boolean = day > 0 && day <= daysInMonth;
      const isToday: boolean =
        isCurrentMonth &&
        today.isSame(currentMonth.date(day), "day") &&
        today.isSame(currentMonth, "month");

      const isInNewCutRange =
        isSelectingCuts &&
        newCutRange[0] !== null &&
        (newCutRange[1] === null
          ? day === newCutRange[0]
          : isCurrentMonth && day >= newCutRange[0]! && day <= newCutRange[1]!);

      days.push(
        <button
          disabled={isSelectingCuts && messCuts.includes(day)}
          onClick={() => handleButtonClick(day)}
          key={i}
          className={`w-10 h-10 flex items-center justify-center rounded-sm text-sm 
            ${isCurrentMonth ? " text-gray-600" : "bg-white"} 
            ${isToday ? "text-primary font-black bg-gray-100" : " font-medium"}
            ${
              isInNewCutRange && !messCuts.includes(day)
                ? "border-2 border-primary"
                : ""
            }
            ${messCuts.includes(day) ? " border-2 border-accent" : "bg-gray-50"}
          `}
        >
          {isCurrentMonth ? day : "-"}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg p-4">
      <div className="w-full flex justify-between border-b-2 border-gray-600 py-2 mb-6">
        <h2 className=" text-gray-600 font-semibold text-lg">
          Handle Messcuts
        </h2>
        <Icon
          icon="mingcute:calendar-fill"
          width="24"
          height="24"
          className=" text-gray-600"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="text-gray-600 hover:text-black text-lg"
        >
          <Icon icon="mynaui:chevron-left-solid" width="28" height="28" />
        </button>
        <h2 className="text-xl font-semibold text-gray-700">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button onClick={nextMonth} className="text-gray-600 text-lg">
          <Icon icon="mynaui:chevron-right-solid" width="28" height="28" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-gray-600 font-semibold">
        {daysOfWeek.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">{generateCalendar()}</div>

      <div className=" w-full flex justify-between mt-6 text-sm font-semibold text-white">
        <button
          className=" bg-primary py-2 rounded-xs w-28"
          onClick={() => setIsSelectingCuts((prev) => !prev)}
        >
          {isSelectingCuts ? "Confirm Cuts" : "Add Cuts"}
        </button>
        {!isSelectingCuts && (
          <button className=" bg-primary py-2 rounded-xs w-28">
            Revoke Cuts
          </button>
        )}
        {isSelectingCuts && (
          <button
            className=" bg-primary py-2 rounded-xs w-28"
            onClick={handleNewCutsCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
