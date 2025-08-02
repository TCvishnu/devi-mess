import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import CalendarDateButton from "@components/user/CalendarDateButton";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import {
  readMessHolidays,
  addMessHolidays,
} from "@services/configurationService";
import type { MessHoliday } from "@type/configuration";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export default function AdminCalendar() {
  const [currentMonthDisplayed, setCurrentMonthDisplayed] = useState<Dayjs>(
    dayjs()
  );

  const [holidays, setHolidays] = useState<Dayjs[]>([]);
  const [newHolidays, setNewHolidays] = useState<Dayjs[]>([]);

  const startOfMonth: Dayjs = currentMonthDisplayed.startOf("month");
  const endOfMonth: Dayjs = currentMonthDisplayed.endOf("month");

  const daysInMonth: number = endOfMonth.date();
  const startDayOfWeek: number = startOfMonth.day();

  const today: Dayjs = dayjs();

  const prevMonth: () => void = () =>
    setCurrentMonthDisplayed(currentMonthDisplayed.subtract(1, "month"));
  const nextMonth: () => void = () =>
    setCurrentMonthDisplayed(currentMonthDisplayed.add(1, "month"));

  const generateCalendar = () => {
    const totalCells = Math.ceil((startDayOfWeek + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, i) => {
      const day = i - startDayOfWeek + 1;
      const date = dayjs(
        new Date(
          currentMonthDisplayed.year(),
          currentMonthDisplayed.month(),
          day
        )
      );
      const dayIsWithinMonthDates = day > 0 && day <= daysInMonth;
      const isToday =
        dayIsWithinMonthDates &&
        today.isSame(currentMonthDisplayed.date(day), "day");
      return (
        <CalendarDateButton
          onClick={() => selectNewHolidays(date)}
          key={i}
          disabled={!dayIsWithinMonthDates}
          className={getDayClassName(isToday, dayIsWithinMonthDates, date)}
        >
          {dayIsWithinMonthDates ? day : "-"}
        </CalendarDateButton>
      );
    });
  };

  const cancelNewHolidaysSelection = () => {
    setNewHolidays([]);
  };

  const selectNewHolidays = (newHoliday: Dayjs) => {
    if (holidays.some((holiday: Dayjs) => holiday.isSame(newHoliday, "day"))) {
      return;
    }
    console.log("epus");
    if (
      newHolidays.some((selectedNewHoliday) =>
        selectedNewHoliday.isSame(newHoliday)
      )
    ) {
      setNewHolidays((prev) =>
        prev.filter(
          (existingNewHoliday) => !existingNewHoliday.isSame(newHoliday, "day")
        )
      );
    } else {
      setNewHolidays((prev) =>
        [...prev, newHoliday].sort((holiday1, holiday2) =>
          holiday1.isBefore(holiday2) ? -1 : 1
        )
      );
    }
  };

  const handleAddNewHolidays = async () => {
    const { status } = await addMessHolidays(newHolidays);
    if (status === 200) {
      setHolidays((prev) =>
        [...prev, ...newHolidays].sort((h1, h2) => (h1.isBefore(h2) ? -1 : 1))
      );
      cancelNewHolidaysSelection();
    }
  };

  const getDayClassName = (
    isToday: boolean,
    dayIsWithinMonthDates: boolean,
    thisHoliday: Dayjs
  ) => {
    return clsx(
      dayIsWithinMonthDates && " bg-[#fafafa]",
      isToday ? "text-primary font-black" : "font-medium",
      newHolidays.some((newHoliday) => newHoliday.isSame(thisHoliday, "day")) &&
        "border-primary border-2",
      holidays.some((holiday) => holiday.isSame(thisHoliday, "day")) &&
        "border-primary border-2 line-through"
    );
  };

  useEffect(() => {
    const fetchMonthlyMessHolidays = async () => {
      const result = await readMessHolidays(
        currentMonthDisplayed.month(),
        currentMonthDisplayed.year()
      );
      if (result.status === 200) {
        setHolidays(result.data.map((date: MessHoliday) => dayjs(date.date)));
      }
    };
    fetchMonthlyMessHolidays();
  }, [currentMonthDisplayed]);

  return (
    <div className="mt-4 w-full items-center flex flex-col">
      <div className="w-full max-w-md bg-white rounded-lg p-4 h-full flex flex-col relative">
        <div className="w-full flex justify-between border-b-2 border-gray-600 py-2 mb-6">
          <h2 className=" text-gray-600 font-semibold text-lg">
            Mess Holidays
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
            className="text-gray-600 hover:text-black text-lg"
            onClick={prevMonth}
          >
            <Icon icon="mynaui:chevron-left-solid" width="28" height="28" />
          </button>
          <h2 className="text-md font-semibold text-gray-700">
            {currentMonthDisplayed.format("MMMM YYYY")}
          </h2>
          <button className="text-gray-600 text-lg" onClick={nextMonth}>
            <Icon icon="mynaui:chevron-right-solid" width="28" height="28" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-gray-600 font-semibold">
          {daysOfWeek.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{generateCalendar()}</div>

        {newHolidays.length > 0 && (
          <div className="flex mt-4 justify-end gap-3">
            <button
              className="p-2 bg-primary text-white rounded-md hover:bg-gray-800 transition-colors"
              title="Confirm"
              onClick={handleAddNewHolidays}
            >
              <Icon icon="fluent:checkmark-16-filled" width="20" height="20" />
            </button>
            <button
              className="p-2 bg-primary text-white rounded-md hover:bg-gray-800 transition-colors"
              title="Cancel"
              onClick={cancelNewHolidaysSelection}
            >
              <Icon icon="fluent:dismiss-16-filled" width="20" height="20" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
