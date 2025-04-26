import { useState, type FC, type ChangeEvent } from "react";
import Input from "../common/components/form/Input";
import PrimaryButton from "../components/user/PrimaryButton";
import PhoneNumberField from "../common/components/form/PhoneNumberField";
import MealTypeButton from "../components/user/MealTypeButton";

type ProfileDataType = {
  fullName: string;
  gender: "MALE" | "FEMALE";
  isVeg: boolean;
  phoneNumber: string;
};
type MealType = "Morning" | "Afternoon" | "Evening" | "Full";

type ResidentialDataType = {
  building: "Devi House" | "Devi Hostel";
  floor: "Top" | "Ground";
};

const MealTypes: { MealType: MealType; icon: string }[] = [
  { MealType: "Morning", icon: "fe:sunrise" },
  { MealType: "Afternoon", icon: "charm:sun" },
  { MealType: "Evening", icon: "lets-icons:moon-fill" },
  { MealType: "Full", icon: "flowbite:bowl-food-solid" },
];

const UserSettings: FC = () => {
  const [profileData, setProfileData] = useState<ProfileDataType>({
    fullName: "Dummy",
    gender: "MALE",
    isVeg: true,
    phoneNumber: "9080706050",
  });

  const [residentialData, setResidentialData] =
    useState<null | ResidentialDataType>({
      building: "Devi Hostel",
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
    <div className="w-full flex flex-col items-center overflow-y-auto">
      <h1 className=" text-xl font-semibold text-primary">Edit Profile</h1>
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
        <PrimaryButton className="w-full text-white font-semibold mt-6">
          Save Changes
        </PrimaryButton>
      </form>

      <div className="mt-10 w-full flex flex-col gap-3">
        <PhoneNumberField
          label="Phone Number"
          name="phoneNumber"
          value={profileData.phoneNumber}
          onChange={handleChange}
        />
        <PrimaryButton className="w-full text-white font-semibold">
          Change Phone Number
        </PrimaryButton>
      </div>

      <span className="mt-12 font-semibold text-primary text-lg">
        Your Meal Plan
      </span>
      <div className="mt-4 w-full flex gap-3 items-center justify-between">
        {MealTypes.map(({ MealType: cutType, icon }) => (
          <MealTypeButton
            key={cutType}
            cutType={cutType}
            icon={icon}
            selectedCutType="Full"
          />
        ))}
      </div>
    </div>
  );
};

export default UserSettings;
