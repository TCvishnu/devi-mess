import { getConfiguration } from "@services/configurationService";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { rateMealKeys, labelRateMealKeys } from "@constants/rateMealKeys";
import { labelGender, floorLabel } from "@constants/label";
import { Gender, BillType } from "@type/enums";

export default function AdminSettings() {
  const [fixedRent, setFixedRent] = useState<
    Record<string, Record<string, number | string>>
  >({
    [BillType.RENT]: { MALE: 0 },
    [BillType.MORNING_MEAL]: { MALE: 0, FEMALE: 0 },
    [BillType.AFTERNOON_MEAL]: { MALE: 0, FEMALE: 0 },
    [BillType.EVENING_MEAL]: { MALE: 0, FEMALE: 0 },
  });

  const [varidableRent, setVariableRent] = useState<
    Record<string, Record<string, number | string>>
  >({
    [BillType.ELECTRICITY]: {
      "ROCKLAND_ARCADE TOP": 0,
      "ROCKLAND_ARCADE GROUND": 0,
      "DEVI_HOUSE TOP": 0,
    },
    [BillType.WIFI]: {
      "ROCKLAND_ARCADE TOP": 0,
      "ROCKLAND_ARCADE GROUND": 0,
      "DEVI_HOUSE TOP": 0,
    },
  });

  const today = dayjs();

  const fetchSettingsConfiguration = async () => {
    const result = await getConfiguration();
    const { settingsData } = result;

    const fixedRents = settingsData
      .filter(
        ({ type }: { type: BillType }) =>
          type !== BillType.ELECTRICITY && type !== BillType.WIFI
      )
      .reduce(
        (
          acc: Record<BillType, Record<string, number>>,
          {
            type,
            classifier,
            amount,
          }: { type: BillType; classifier: string; amount: number }
        ) => {
          if (!acc[type]) {
            acc[type] = {};
          }
          acc[type][classifier] = amount;
          return acc;
        },
        {}
      );
    const variableRents = settingsData
      .filter(
        ({ type }: { type: BillType }) =>
          type === BillType.ELECTRICITY || type === BillType.WIFI
      )
      .reduce(
        (
          acc: Record<BillType, Record<string, number>>,
          {
            type,
            classifier,
            amount,
          }: { type: BillType; classifier: string; amount: number }
        ) => {
          if (!acc[type]) {
            acc[type] = {};
          }
          acc[type][classifier] = amount;
          return acc;
        },
        {}
      );
    setFixedRent(fixedRents);
    setVariableRent(variableRents);
  };

  const handleChange = (
    type: BillType,
    classifier: string,
    e: React.ChangeEvent<HTMLInputElement>,
    isFixed: boolean
  ) => {
    const value = e.target.value;
    const updater = isFixed ? setFixedRent : setVariableRent;

    updater((prev) => ({
      ...prev,
      [type]: {
        ...(prev[type] || {}),
        [classifier]: value === "" ? "" : Number(value),
      },
    }));
  };

  const handleInputChange = (
    type: BillType,
    classifier: string,
    value: number,
    isFixed: boolean
  ) => {
    const updater = isFixed ? setFixedRent : setVariableRent;

    updater((prev: Record<BillType, Record<string, number | string>>) => ({
      ...prev,
      [type]: {
        ...(prev[type] || {}),
        [classifier]: value,
      },
    }));
  };

  useEffect(() => {
    fetchSettingsConfiguration();
  }, []);
  return (
    <div className="w-full min-h-screen py-6 ">
      <div className="rounded-2xl space-y-8 w-full">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Hostel Rent
          </h2>
          <input
            value={fixedRent["RENT"]["MALE"]}
            onChange={(e) => handleChange(BillType.RENT, "MALE", e, true)}
            placeholder="Enter rent amount"
            className="w-full p-3 border rounded-md shadow-sm outline-none"
          />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4">Meal Rates</h2>
          {rateMealKeys.map((meal) => (
            <div key={meal} className="mb-6">
              <h3 className="text-lg font-medium mb-2">
                {labelRateMealKeys[meal]} Meal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[Gender.Male, Gender.Female].map((gender) => (
                  <div key={gender}>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {labelGender[gender]}
                    </label>
                    <input
                      value={fixedRent[meal][gender]}
                      onChange={(e) =>
                        handleChange(BillType[meal], gender, e, true)
                      }
                      type="number"
                      placeholder={`${labelRateMealKeys[meal]} - ${labelGender[gender]}`}
                      className="w-full p-3 border rounded-md shadow-sm outline-none text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <button className="w-full mb-4 py-3 bg-primary text-white rounded-md shadow-md ">
          Save Fixed Rates
        </button>

        <section>
          <div className="w-full flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              Electricity Charges (Per Floor)
            </h2>
            <span className=" font-semibold text-sm">
              - {today.subtract(1, "month").format("MMM")}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "ROCKLAND_ARCADE TOP",
              "ROCKLAND_ARCADE GROUND",
              "DEVI_HOUSE TOP",
            ].map((floor) => (
              <div key={floor}>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {floorLabel[floor]}
                </label>
                <input
                  type="number"
                  value={varidableRent["ELECTRICITY"][floor]}
                  onChange={(e) =>
                    handleChange(BillType.ELECTRICITY, floor, e, false)
                  }
                  placeholder={`${floorLabel[floor]} `}
                  className="w-full p-3 border rounded-md shadow-sm outline-none text-sm"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="w-full flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              WiFi Charges (Per Floor)
            </h2>
            <span className=" font-semibold text-sm">
              - {today.subtract(1, "month").format("MMM")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "ROCKLAND_ARCADE TOP",
              "ROCKLAND_ARCADE GROUND",
              "DEVI_HOUSE TOP",
            ].map((floor) => (
              <div key={floor}>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {floorLabel[floor]}
                </label>
                <input
                  type="number"
                  value={varidableRent["WIFI"][floor]}
                  onChange={(e) => handleChange(BillType.WIFI, floor, e, false)}
                  placeholder={`${floorLabel[floor]} `}
                  className="w-full p-3 border rounded-md shadow-sm focus:outline-none outline-none text-sm"
                />
              </div>
            ))}
          </div>
        </section>

        <button className="w-full mb-4 py-3 bg-primary text-white rounded-md shadow-md ">
          Save {today.subtract(1, "month").format("MMM")} Month's Rates
        </button>
      </div>
    </div>
  );
}
