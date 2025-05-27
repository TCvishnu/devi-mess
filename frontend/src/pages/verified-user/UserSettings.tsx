import { useState, type FC, type ChangeEvent } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";

import Input from "../../common/components/form/Input";
import PhoneNumberField from "../../common/components/form/PhoneNumberField";
import type { ProfileDataType, ResidentialDataType } from "../../types/user";
import { mealTypes } from "@constants/mealTypes";
import Button from "../../common/components/button/Button";

const UserSettings: FC = () => {
  const [profileData, setProfileData] = useState<ProfileDataType>({
    fullName: "Dummy",
    gender: "MALE",
    isVeg: true,
    phoneNumber: "9080706050",
    mealType: "FULL",
  });

  const meal = mealTypes.find(
    (mealType) => mealType.mealType === profileData.mealType
  );

  const [residentialData, setResidentialData] =
    useState<null | ResidentialDataType>({
      building: "Rockland Arcade",
      floor: "Top",
    });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFoodTypeChange = (isVeg: boolean) => {
    setProfileData((prev) => ({ ...prev, isVeg }));
  };

  return (
    <div className="w-full flex flex-col items-center overflow-y-auto pb-4">
      <h1 className=" text-xl font-semibold text-primary mt-2"> Profile</h1>
      <form className="w-full flex flex-col gap-2">
        <Input
          label="Full name"
          name="fullName"
          value={profileData.fullName}
          onChange={handleChange}
        />

        <div className="flex flex-col gap-1">
          <span className="opacity-60 font-semibold">Food Type</span>
          <div className="w-full flex justify-between">
            <button
              type="button"
              className={`${
                profileData.isVeg ? "border-2 border-primary" : ""
              } py-2 w-40 rounded-md font-semibold`}
              onClick={() => handleFoodTypeChange(true)}
            >
              Veg
            </button>
            <button
              type="button"
              className={`${
                !profileData.isVeg ? "border-primary border-2 " : ""
              } py-2 w-40 rounded-md font-semibold`}
              onClick={() => handleFoodTypeChange(false)}
            >
              Non-Veg
            </button>
          </div>
        </div>
        <Button
          className="w-full text-white font-semibold mt-6 h-12"
          radiusSize="sm"
        >
          Update
        </Button>
      </form>

      <div className="w-full border border-gray-300 my-8" />

      <div className="w-full flex flex-col gap-6">
        <PhoneNumberField
          label="Phone Number"
          name="phoneNumber"
          value={profileData.phoneNumber}
          onChange={handleChange}
        />
        <Button
          className="w-full text-white font-semibold h-12"
          radiusSize="sm"
        >
          Change Phone Number
        </Button>
      </div>

      <div className="w-full border border-gray-300 my-8" />

      <div className="w-full grid grid-cols-2 text-gray-600 font-semibold gap-4 py-4">
        <div className="col-span-1 flex flex-col items-center gap-1 bg-primary-50 rounded-xl p-3">
          <span className="text-sm uppercase tracking-wide ">
            {profileData.gender}
          </span>
          <Icon
            icon={
              profileData.gender === "MALE"
                ? "ion:male-sharp"
                : "ion:female-sharp"
            }
            className="size-20 text-primary"
          />
        </div>

        <div className="col-span-1 flex flex-col items-center gap-1 bg-primary-50 rounded-xl p-3">
          <span className="text-sm uppercase tracking-wide ">
            {profileData.mealType === "FULL"
              ? "Full Day Meal"
              : `${profileData.mealType} Only`}
          </span>
          {meal ? (
            <Icon icon={meal.icon} className="size-20 text-primary" />
          ) : (
            <span className="text-xs text-red-400 italic">
              Unknown meal type
            </span>
          )}
        </div>
      </div>

      {residentialData && (
        <div className="w-full flex flex-col items-center gap-4">
          <span className="font-semibold text-lg text-primary tracking-wide">
            Stay Details
          </span>

          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center py-4 px-2">
              <Icon
                icon="mingcute:building-2-fill"
                className="size-20 text-secondary-700"
              />
              <span className="mt-2 text-sm font-medium text-gray-500">
                Building
              </span>
              <span className="font-semibold text-lg text-primary text-center">
                {residentialData.building}
              </span>
            </div>

            <div className="flex flex-col items-center py-4 px-2 ">
              <Icon
                icon="game-icons:stairs"
                className="size-20 text-secondary-700"
              />
              <span className="mt-2 text-sm text-gray-500 font-medium">
                Floor
              </span>
              <span className="font-semibold text-lg text-primary">
                {residentialData.floor} Floor
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings;
