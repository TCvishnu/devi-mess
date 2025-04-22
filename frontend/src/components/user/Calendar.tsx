import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import type { FC } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { clsx } from "clsx";

import PrimaryButton from "./PrimaryButton";
import CalendarDateButton from "./CalendarDateButton";

const daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarProps = {
  messCuts: number[];
};

const Calendar: FC<CalendarProps> = ({ messCuts }) => {
  const [currentMonthDisplayed, setCurrentMonthDisplayed] = useState<Dayjs>(
    dayjs()
  );
  const [isSelectingCuts, setIsSelectingCuts] = useState<boolean>(false);
  const [newCutRange, setNewCutRange] = useState<
    [number | null, number | null]
  >([null, null]);

  const startOfMonth: Dayjs = currentMonthDisplayed.startOf("month");
  const endOfMonth: Dayjs = currentMonthDisplayed.endOf("month");

  const daysInMonth: number = endOfMonth.date();
  const startDayOfWeek: number = startOfMonth.day();

  const today: Dayjs = dayjs();

  const prevMonth: () => void = () =>
    setCurrentMonthDisplayed(currentMonthDisplayed.subtract(1, "month"));
  const nextMonth: () => void = () =>
    setCurrentMonthDisplayed(currentMonthDisplayed.add(1, "month"));

  const toggleSelectingCuts: () => void = () => {
    setIsSelectingCuts((prev) => !prev);
  };

  const handleButtonClick = (day: number) => {
    if (!isSelectingCuts) return;

    const [start, end] = newCutRange;

    if (start === null || (start !== null && end !== null)) {
      // if start is null start selecting the range OR if the range has already been selected then reset
      setNewCutRange([day, null]);
    } else if (start !== null && end === null) {
      // start range selected, end not selected
      if (day === start) {
        // user wants single day cut
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

  const getDayClassNames = (
    day: number,
    dayIsWithinMonthDates: boolean,
    isToday: boolean,
    isInNewCutRange: boolean,
    messCuts: number[]
  ) => {
    return clsx(
      dayIsWithinMonthDates ? "text-gray-600" : "bg-white",
      isToday ? "text-primary font-black" : "font-medium",
      isInNewCutRange && !messCuts.includes(day) && "border-2 border-primary",
      messCuts.includes(day) ? "border-2 border-accent" : "bg-gray-50"
    );
  };

  const isDayInNewCutRange = (day: number): boolean => {
    if (!isSelectingCuts || newCutRange[0] === null) return false;
    if (newCutRange[1] === null) return day === newCutRange[0];
    return day >= newCutRange[0] && day <= newCutRange[1];
  };

  const generateCalendar = () => {
    const totalCells = Math.ceil((startDayOfWeek + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, i) => {
      const day = i - startDayOfWeek + 1;
      const dayIsWithinMonthDates = day > 0 && day <= daysInMonth;
      const isToday =
        dayIsWithinMonthDates &&
        today.isSame(currentMonthDisplayed.date(day), "day");
      const isInNewCutRange = dayIsWithinMonthDates && isDayInNewCutRange(day);

      return (
        <CalendarDateButton
          key={i}
          onClick={() => handleButtonClick(day)}
          disabled={isSelectingCuts && messCuts.includes(day)}
          className={getDayClassNames(
            day,
            dayIsWithinMonthDates,
            isToday,
            isInNewCutRange,
            messCuts
          )}
        >
          {dayIsWithinMonthDates ? day : "-"}
        </CalendarDateButton>
      );
    });
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
          {currentMonthDisplayed.format("MMMM YYYY")}
        </h2>
        <button onClick={nextMonth} className="text-gray-600 text-lg">
          <Icon icon="mynaui:chevron-right-solid" width="28" height="28" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-gray-600 font-semibold">
        {daysOfWeek.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">{generateCalendar()}</div>

      <div className="w-full flex justify-between mt-6 text-sm font-semibold text-white">
        <PrimaryButton onClick={toggleSelectingCuts}>
          {isSelectingCuts ? "Confirm Cuts" : "Add Cuts"}
        </PrimaryButton>
        {isSelectingCuts ? (
          <PrimaryButton onClick={handleNewCutsCancel}>Cancel</PrimaryButton>
        ) : (
          <PrimaryButton>Revoke Cuts</PrimaryButton>
        )}
      </div>
    </div>
  );
};

export default Calendar;
