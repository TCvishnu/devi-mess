import { FC, ReactNode, createContext, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

type DateContextType = {
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
};

type DateContextProviderType = {
  children: ReactNode;
};

export const DateContext = createContext<DateContextType | undefined>(
  undefined
);

export const DateContextProvider: FC<DateContextProviderType> = ({
  children,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};
