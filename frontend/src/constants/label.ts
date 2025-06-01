import { Gender, BillType } from "@type/enums";

export const labelGender: Record<Gender, string> = {
  [Gender.Male]: "Male",
  [Gender.Female]: "Female",
};

export const floorLabel: Record<string, string> = {
  "ROCKLAND_ARCADE TOP": "Rockland Arcade Top Floor",
  "ROCKLAND_ARCADE GROUND": "Rockland Arcade Ground Floor",
  "DEVI_HOUSE TOP": "Devi Veed Top Floor",
};

export const residentialBillTypeLabel: Record<string, string> = {
  [BillType.RENT]: "Room Rent",
  [BillType.ELECTRICITY]: "Electricity Bill",
  [BillType.WIFI]: "WiFi Charges",
};
