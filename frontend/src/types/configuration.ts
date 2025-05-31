import { BillType } from "./enums";

export type BillTypeConfiguration = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: BillType;
  classifier: string;
  amount: number | string;
};
