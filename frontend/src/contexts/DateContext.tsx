import { FC, ReactNode, createContext, useState, useContext } from "react";
import dayjs, { Dayjs } from "dayjs";

type DateContextType = {
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
};

type DateContextProviderType = {
  children: ReactNode;
};

const DateContext = createContext<DateContextType | undefined>(undefined);

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

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};
