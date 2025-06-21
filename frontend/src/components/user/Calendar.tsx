import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import type { FC } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { clsx } from "clsx";
import { toTitleCase } from "@utils/stringUtils";

import PrimaryButton from "./PrimaryButton";
import CalendarDateButton from "./CalendarDateButton";
import MealTypeButton from "./MealTypeButton";
import { mealTypes } from "@constants/mealTypes";
import { MealType } from "@type/enums";
import { Messcut } from "@type/user";
import { DisplayingCutType } from "@type/messcuts";

//api endpoints
import {
  readMonthlyMessCuts,
  createMesscuts,
  deleteMessCuts,
} from "@services/messcutService";

import useAuthContext from "@contexts/useAuthContext";
import useTimer from "@hooks/useTimer";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CutID = string;

const Calendar: FC = () => {
  const { user } = useAuthContext();

  const [currentMonthDisplayed, setCurrentMonthDisplayed] = useState<Dayjs>(
    dayjs()
  );
  const [isSelectingCuts, setIsSelectingCuts] = useState<boolean>(false);
  const [isRemovingCuts, setIsRemovingCuts] = useState<boolean>(false);
  const [selectedCutType, setSelectedCutType] = useState<MealType>(
    user?.mealType as MealType
  );
  const [newCutRange, setNewCutRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);
  const [messCuts, setMessCuts] = useState<DisplayingCutType[]>([]);

  useEffect(() => console.log(messCuts), [messCuts]);

  const [cutsToRemove, setCutsToRemove] = useState<Set<CutID>>(new Set());

  const [popupInfo, setPopupInfo] = useState<{
    day: Dayjs;
    cutType: string;
    position: { top: number; left: number };
  } | null>(null);
  const { resetTimer } = useTimer(2, () => setPopupInfo(null));

  const startOfMonth: Dayjs = currentMonthDisplayed.startOf("month");
  const endOfMonth: Dayjs = currentMonthDisplayed.endOf("month");

  const daysInMonth: number = endOfMonth.date();
  const startDayOfWeek: number = startOfMonth.day();

  const today: Dayjs = dayjs();

  const prevMonth: () => void = () =>
    setCurrentMonthDisplayed(currentMonthDisplayed.subtract(1, "month"));
  const nextMonth: () => void = () =>
    setCurrentMonthDisplayed(currentMonthDisplayed.add(1, "month"));

  const handleCutTypeChange = (cutType: MealType) => {
    setSelectedCutType(cutType);
  };

  const handleButtonClick = (
    day: Dayjs,
    matchingCut: DisplayingCutType | undefined,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (isSelectingCuts) {
      changeNewCutRange(day);
      return;
    }

    if (!matchingCut) return;
    if (isRemovingCuts) {
      changeCutRemovalDays(matchingCut.id);
      return;
    }

    // display cut type for user to see
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopupInfo({
      day,
      cutType: matchingCut.cutType,
      position: {
        top: rect.bottom + 4,
        left: (rect.left + rect.right) / 2,
      },
    });

    resetTimer();
  };

  const changeNewCutRange = (day: Dayjs) => {
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
        const sortedRange = [start, day].sort(
          (a, b) => a.date() - b.date() && a.month() - b.month()
        );
        setNewCutRange([sortedRange[0], sortedRange[1]]);
      }
    }
  };

  const changeCutRemovalDays = (cutID: CutID) => {
    setCutsToRemove((prev) => {
      const updatedSet = new Set(prev);
      if (!updatedSet.has(cutID)) {
        updatedSet.add(cutID);
      } else {
        updatedSet.delete(cutID);
      }
      return updatedSet;
    });
  };

  const handleNewCutsCancel: () => void = () => {
    setIsSelectingCuts(false);
    setNewCutRange([null, null]);
    setSelectedCutType(user?.mealType || MealType.Full);
  };

  const getDayClassNames = (
    day: Dayjs,
    dayIsWithinMonthDates: boolean,
    isToday: boolean,
    isInNewCutRange: boolean,
    matchingCut: DisplayingCutType | undefined
  ) => {
    const thisDayIsCutDay = messCuts.some((cut) => cut.date.isSame(day, "day"));
    const selectedToRemove = matchingCut && cutsToRemove?.has(matchingCut?.id);

    return clsx(
      dayIsWithinMonthDates ? "text-gray-800" : "bg-white",
      isToday ? "text-primary font-black" : "font-medium",
      isInNewCutRange &&
        !messCuts.some((cut) => cut.date.isSame(day, "day")) &&
        "border-2 border-primary",
      thisDayIsCutDay
        ? selectedToRemove
          ? "border-2 border-accent line-through decoration-accent"
          : "border-2 border-primary line-through decoration-primary"
        : "bg-gray-50"
    );
  };

  const isDayInNewCutRange = (day: Dayjs): boolean => {
    if (!isSelectingCuts || newCutRange[0] === null) return false;
    if (newCutRange[1] === null) return day.isSame(newCutRange[0], "day");
    return (
      (day.isSame(newCutRange[0], "day") || day.isAfter(newCutRange[0])) &&
      (day.isSame(newCutRange[1], "day") || day.isBefore(newCutRange[1]))
    );
  };

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
      const isInNewCutRange = dayIsWithinMonthDates && isDayInNewCutRange(date);

      const disableDuringNewCuts =
        isSelectingCuts && // while selecting cuts
        (date.isBefore(today, "day") || // dates before today not allowed
          (date.isSame(today, "day") && dayjs().hour() >= 6) || // cut today after today 6am not allowed
          messCuts.some((cut) => cut.date.isSame(date, "day"))); // already the cut is there

      const disableDuringCutRemoval =
        isRemovingCuts && // while removing existing cuts
        (date.isBefore(today, "day") || // dates before today cut removal not allowed
          messCuts.every((cut) => !cut.date.isSame(date, "day"))); // non cut dates disabled

      const matchingCut = messCuts.find((cut) => cut.date.isSame(date, "day"));

      return (
        <CalendarDateButton
          key={i}
          onClick={(e) => handleButtonClick(date, matchingCut, e)}
          disabled={disableDuringNewCuts || disableDuringCutRemoval}
          className={getDayClassNames(
            date,
            dayIsWithinMonthDates,
            isToday,
            isInNewCutRange,
            matchingCut
          )}
        >
          {dayIsWithinMonthDates ? day : "-"}
        </CalendarDateButton>
      );
    });
  };

  const handleConfirmNewCuts = async () => {
    if (!newCutRange[0] && !newCutRange[1]) {
      handleNewCutsCancel();
      return;
    }
    if (!user) return;
    const result = await createMesscuts(
      user?.id as string,
      newCutRange,
      selectedCutType,
      currentMonthDisplayed.month(),
      currentMonthDisplayed.year()
    );
    if (result.status !== 201) {
      handleNewCutsCancel();
      return;
    }
    console.log("cjeck: ", result.data);
    if (result.data.length === 1) {
      const { id, cutType, date } = result.data[0];
      setMessCuts((prev) => [...prev, { id, cutType, date: dayjs(date) }]);
    } else {
      setMessCuts(
        result.data.map((cut: Messcut) => ({
          id: cut.id,
          cutType: cut.cutType,
          date: dayjs(cut.date),
        }))
      );
    }

    handleNewCutsCancel();
  };

  const handleCutRemovalCancel = () => {
    setCutsToRemove(new Set());
    setIsRemovingCuts(false);
  };

  const handleRemoveCuts = async () => {
    const cutIDs = Array.from(cutsToRemove);

    if (!cutIDs.length) {
      handleCutRemovalCancel();
    }
    if (!user || !user.id) return;
    const result = await deleteMessCuts(user.id, cutIDs);

    if (result.status === 200) {
      const cutsLeft = messCuts.filter(
        (cut: DisplayingCutType) => !cutsToRemove.has(cut.id)
      );
      setMessCuts(cutsLeft);
    }
    handleCutRemovalCancel();
  };

  useEffect(() => {
    const fetchMonthlyMessCuts = async () => {
      if (!user) return;
      const result = await readMonthlyMessCuts(
        user?.id as string,
        currentMonthDisplayed.month(),
        currentMonthDisplayed.year()
      );
      if (result.status === 200) {
        setMessCuts(
          result.data.map((cutDate: Messcut) => ({
            id: cutDate.id,
            cutType: cutDate.cutType,
            date: dayjs(cutDate.date),
          }))
        );
        // console.log(result.data.map((cutDate: Messcut) => cutDate.id));
      }
    };

    fetchMonthlyMessCuts();
  }, [currentMonthDisplayed]);

  return (
    <div className="w-full max-w-md bg-white rounded-lg p-4 h-full flex flex-col relative">
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

      <div className="w-full flex justify-between h-full items-end pb-8 mt-2">
        {isSelectingCuts &&
          mealTypes.map(({ mealType, icon }) => (
            <MealTypeButton
              disabled={mealType !== user?.mealType}
              key={mealType}
              mealType={mealType}
              icon={icon}
              selectedMealType={selectedCutType}
              onClick={() => handleCutTypeChange(mealType)}
            />
          ))}
        {isRemovingCuts && (
          <p className="text-center w-full text-gray-400 font-medium">
            Select Mess Cut dates to cancel
          </p>
        )}
      </div>

      <div className="w-full flex justify-between items-end gap-4 text-sm font-semibold text-white">
        {!isSelectingCuts && !isRemovingCuts && (
          <>
            <PrimaryButton onClick={() => setIsSelectingCuts(true)}>
              Add Cuts
            </PrimaryButton>
            <PrimaryButton onClick={() => setIsRemovingCuts(true)}>
              Remove Cuts
            </PrimaryButton>
          </>
        )}

        {isSelectingCuts && !isRemovingCuts && (
          <>
            <PrimaryButton onClick={handleConfirmNewCuts}>
              Confirm Cuts
            </PrimaryButton>
            <PrimaryButton onClick={handleNewCutsCancel}>Cancel</PrimaryButton>
          </>
        )}
        {!isSelectingCuts && isRemovingCuts && (
          <>
            <PrimaryButton onClick={handleRemoveCuts}>
              Confirm Removal
            </PrimaryButton>
            <PrimaryButton onClick={handleCutRemovalCancel}>
              Cancel
            </PrimaryButton>
          </>
        )}
      </div>
      {popupInfo && (
        <div
          className="fixed z-50 font-bold text-black shadow-md"
          style={{
            top: popupInfo.position.top,
            left: popupInfo.position.left,
            transform: "translateX(-50%)",
          }}
        >
          <div className="relative bg-primary text-xs text-white size-14 xs:size-16 rounded-md speech-bubble flex flex-col justify-center items-center">
            <Icon icon="material-symbols:info-rounded" className="size-5" />
            <span className="block truncate max-w-[120px]">
              {popupInfo.cutType === MealType.Full
                ? "Full Day"
                : toTitleCase(popupInfo.cutType)}
            </span>
            <span>Cut</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
