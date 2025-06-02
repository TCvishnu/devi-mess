import {
  getConfiguration,
  updateFixedConfig,
} from "@services/configurationService";
import dayjs from "dayjs";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { rateMealKeys, labelRateMealKeys } from "@constants/rateMealKeys";
import { labelGender, floorLabel } from "@constants/label";
import { Gender } from "@type/enums";
import { BillTypeConfiguration } from "@type/configuration";

import { generateRent } from "@services/billService";

const fixedSkipIndex = [7, 0, 5];

export default function AdminSettings() {
  const [config, setConfig] = useState<BillTypeConfiguration[]>([]);

  const initialData = useRef<BillTypeConfiguration[]>([]);

  const fetchSettingsConfiguration = async () => {
    const result = await getConfiguration();
    const { settingsData } = result;
    setConfig(settingsData);
    initialData.current = JSON.parse(JSON.stringify(settingsData)); // deeeep copy
    console.log(
      settingsData.map((setting: BillTypeConfiguration) => [
        setting.type,
        setting.classifier,
      ])
    );
  };

  useEffect(() => {
    fetchSettingsConfiguration();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    setConfig((prev: BillTypeConfiguration[]) => {
      const tempConfig = [...prev];
      tempConfig[index].amount = e.target.value.length
        ? Number(e.target.value)
        : "";
      return tempConfig;
    });
  };

  const validateFixedChange = () => {
    let changedPrices: { id: string; amount: number }[] = [];
    for (let i = 0; i < 10; i++) {
      if (i >= 2 && i <= 4) {
        continue;
      }
      if (Number(config[i].amount) !== initialData.current[i].amount) {
        changedPrices.unshift({
          id: config[i].id,
          amount: Number(config[i].amount),
        });
      }
    }
    console.log(changedPrices);
    return changedPrices;
  };

  const handleFixedConfigUpdation = async () => {
    const changedPrices = validateFixedChange();
    if (!changedPrices.length) {
      console.log("nope");
      return;
    }

    const { status } = await updateFixedConfig(changedPrices);

    if (status === 200) {
      initialData.current = JSON.parse(JSON.stringify(config)); // deep copy
      console.log(initialData.current);
    }
  };

  const handleGen = () => {
    generateRent([]);
  };

  if (!config.length) {
    return (
      <div className=" flex items-center justify-center h-full">
        <div className="size-32 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen py-6 ">
      <div className="rounded-2xl space-y-8 w-full">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Hostel Rent
          </h2>
          <input
            value={config[9].amount}
            type="Number"
            onChange={(e) => handleChange(e, 9)}
            placeholder="Enter rent amount"
            className="w-full p-3 border rounded-md shadow-sm outline-none"
          />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4">Meal Rates</h2>
          {rateMealKeys.map((meal, i) => (
            <div key={meal} className="mb-6">
              <h3 className="text-lg font-medium mb-2">
                {labelRateMealKeys[meal]} Meal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[Gender.Male, Gender.Female].map((gender, index) => (
                  <div key={gender}>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {labelGender[gender]}
                    </label>
                    <input
                      value={config[fixedSkipIndex[i] + index].amount}
                      onChange={(e) =>
                        handleChange(e, fixedSkipIndex[i] + index)
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

        <button
          className="w-full mb-4 py-3 bg-primary text-white rounded-md shadow-md "
          onClick={handleFixedConfigUpdation}
        >
          Save Fixed Rates
        </button>

        <section className="mt-10">
          <div className="w-full flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              Electricity Charges (Per Floor)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "ROCKLAND_ARCADE TOP",
              "ROCKLAND_ARCADE GROUND",
              "DEVI_HOUSE TOP",
            ].map((floor, index) => (
              <div key={floor}>
                <div className="w-full flex justify-between items-center">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    {floorLabel[floor]}
                  </label>
                  <span className="text-xs">
                    - {dayjs(config[2 + index].updatedAt).format("MMM")}
                  </span>
                </div>

                <input
                  type="number"
                  onChange={(e) => handleChange(e, 2 + index)}
                  value={config[2 + index].amount}
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "ROCKLAND_ARCADE TOP",
              "ROCKLAND_ARCADE GROUND",
              "DEVI_HOUSE TOP",
            ].map((floor, index) => (
              <div key={floor}>
                <div className="w-full flex justify-between items-center">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    {floorLabel[floor]}
                  </label>
                  <span className="text-xs">
                    - {dayjs(config[10 + index].updatedAt).format("MMM")}
                  </span>
                </div>
                <input
                  value={config[10 + index].amount}
                  onChange={(e) => handleChange(e, 10 + index)}
                  type="number"
                  placeholder={`${floorLabel[floor]} `}
                  className="w-full p-3 border rounded-md shadow-sm focus:outline-none outline-none text-sm"
                />
              </div>
            ))}
          </div>
        </section>

        <button
          className="w-full mb-4 py-3 bg-primary text-white rounded-md shadow-md "
          onClick={handleGen}
        >
          Generate Resident Bills
        </button>
      </div>
    </div>
  );
}
