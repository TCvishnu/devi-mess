export enum BillType {
  RENT = "RENT",
  ELECTRICITY = "ELECTRICITY",
  WIFI = "WIFI",
  MORNING_MEAL = "MORNING_MEAL",
  AFTERNOON_MEAL = "AFTERNOON_MEAL",
  EVENING_MEAL = "EVENING_MEAL",
  FULL_MEAL = "FULL_MEAL",
}

export type BillComponent = {
  id: string;
  userBillid: string;
  totalDays: number;
  amount: number;
  type: BillType;
};
