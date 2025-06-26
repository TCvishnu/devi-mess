import { createContext } from "react";
import { Dayjs } from "dayjs";

type DateContextType = {
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
};

export const DateContext = createContext<DateContextType | undefined>(
  undefined
);
