import { useState, type FC, type ChangeEvent } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";

import Input from "../common/components/form/Input";
import PhoneNumberField from "../common/components/form/PhoneNumberField";
import type { ProfileDataType, ResidentialDataType } from "../types/user";
import { mealTypes } from "@constants/mealTypes";
import Button from "../common/components/button/Button";

const UserSettings: FC = () => {
  const [profileData, setProfileData] = useState<ProfileDataType>({
    fullName: "Dummy",
    gender: "FEMALE",
    isVeg: true,
    phoneNumber: "9080706050",
    mealType: "Full",
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

  const handleGenderChange = (gender: "MALE" | "FEMALE") => {
    setProfileData((prev) => ({ ...prev, gender }));
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

      <div className="w-full grid grid-cols-2 text-primary font-semibold">
        <div className="col-span-1 flex flex-col items-center gap-2">
          {/* use toTitleCase util function here after merge */}
          <span>{profileData.gender === "MALE" ? "Male" : "Female"}</span>

          {profileData.gender === "MALE" ? (
            <Icon icon="ion:male-sharp" className="size-18" />
          ) : (
            <Icon icon="ion:female-sharp" className="size-18" />
          )}
        </div>
        <div className=" col-span-1 flex flex-col items-center gap-2">
          <span>
            {profileData.mealType + " "}
            {profileData.mealType === "Full" ? "Day Meal" : "Only"}
          </span>

          {meal ? (
            <Icon icon={meal.icon} className=" size-18" />
          ) : (
            // just for type safety. no such case
            <span>Unknown meal type</span>
          )}
        </div>
      </div>

      {residentialData && (
        <>
          <div className="w-full border border-gray-300 my-4" />

          <div className="w-full flex flex-col gap-2 items-center ">
            <span className="font-semibold opacity-60 text-lg">
              Stay Details
            </span>
            <div className="grid grid-cols-2 w-full text-primary">
              <div className="flex flex-col items-center">
                <Icon icon="mingcute:building-2-fill" className="size-16" />
                <span className=" font-semibold">
                  {residentialData.building}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <Icon icon="game-icons:stairs" className="size-16" />
                <span className=" font-semibold ">
                  {residentialData.floor} Floor
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserSettings;
