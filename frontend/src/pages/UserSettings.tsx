import { useState, type FC, type ChangeEvent } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";

import Input from "../common/components/form/Input";
import PhoneNumberField from "../common/components/form/PhoneNumberField";
import MealTypeButton from "../components/user/MealTypeButton";
import type { ProfileDataType, ResidentialDataType } from "../types/user";
import { mealTypes } from "@constants/mealTypes";
import Button from "../common/components/button/Button";

const UserSettings: FC = () => {
  const [profileData, setProfileData] = useState<ProfileDataType>({
    fullName: "Dummy",
    gender: "MALE",
    isVeg: true,
    phoneNumber: "9080706050",
    mealType: "Full",
  });

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

  const handleGenderChange = (gender: "MALE" | "FEMALE") => {
    setProfileData((prev) => ({ ...prev, gender }));
  };

  const handleFoodTypeChange = (isVeg: boolean) => {
    setProfileData((prev) => ({ ...prev, isVeg }));
  };

  return (
    <div className="w-full flex flex-col items-center overflow-y-auto pb-4">
      <h1 className=" text-xl font-semibold text-primary mt-2">Edit Profile</h1>
      <form className="w-full flex flex-col gap-2">
        <Input
          label="Full name"
          name="fullName"
          value={profileData.fullName}
          onChange={handleChange}
        />

        <div className="flex flex-col gap-1">
          <span className="opacity-60 font-semibold">Gender</span>
          <div className="w-full flex justify-between">
            <button
              type="button"
              className={`${
                profileData.gender === "MALE" ? "border-2 border-primary" : ""
              } py-3 w-40 rounded-md font-semibold`}
              onClick={() => handleGenderChange("MALE")}
            >
              Male
            </button>
            <button
              type="button"
              className={`${
                profileData.gender === "FEMALE" ? "border-2 border-primary" : ""
              } py-3 w-40 rounded-md font-semibold`}
              onClick={() => handleGenderChange("FEMALE")}
            >
              Female
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="opacity-60 font-semibold">Food Type</span>
          <div className="w-full flex justify-between">
            <button
              type="button"
              className={`${
                profileData.isVeg ? "border-2 border-primary" : ""
              } py-3 w-40 rounded-md font-semibold`}
              onClick={() => handleFoodTypeChange(true)}
            >
              Veg
            </button>
            <button
              type="button"
              className={`${
                !profileData.isVeg ? "border-primary border-2 " : ""
              } py-3 w-40 rounded-md font-semibold`}
              onClick={() => handleFoodTypeChange(false)}
            >
              non-Veg
            </button>
          </div>
        </div>
        <Button
          className="w-full text-white font-semibold mt-6"
          radiusSize="sm"
        >
          Save Changes
        </Button>
      </form>

      <div className="mt-10 w-full flex flex-col gap-3">
        <PhoneNumberField
          label="Phone Number"
          name="phoneNumber"
          value={profileData.phoneNumber}
          onChange={handleChange}
        />
        <Button className="w-full text-white font-semibold" radiusSize="sm">
          Change Phone Number
        </Button>
      </div>

      <span className="mt-12 font-semibold opacity-60 text-lg">
        Your Meal Plan
      </span>
      <div className="mt-4 w-full flex gap-3 items-center justify-between">
        {mealTypes.map(({ mealType, icon }) => (
          <MealTypeButton
            key={mealType}
            mealType={mealType}
            icon={icon}
            selectedMealType={profileData.mealType}
          />
        ))}
      </div>

      {residentialData && (
        <div className="mt-4 w-full flex flex-col gap-2 items-center ">
          <span className="mt-12 font-semibold opacity-60 text-lg">
            Stay Details
          </span>
          <div className="flex gap-1 items-center justify-around w-full text-primary">
            <div className="flex flex-col items-center">
              <Icon icon="mingcute:building-2-fill" className="size-16" />
              <span className=" font-semibold">{residentialData.building}</span>
            </div>

            <div className="flex flex-col items-center">
              <Icon icon="game-icons:stairs" className="size-16" />
              <span className=" font-semibold ">
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
