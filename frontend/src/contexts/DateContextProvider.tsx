import { FC, ReactNode, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DateContext } from "./DateContext"; // adjust import path if needed

type DateContextProviderProps = {
  children: ReactNode;
};

export const DateContextProvider: FC<DateContextProviderProps> = ({
  children,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};
