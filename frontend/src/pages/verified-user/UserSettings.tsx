import { useState, type FC, type ChangeEvent } from "react";
import { Icon } from "@iconify/react";

import { updateNameAndFoodPreference } from "@services/verifiedUserService";

import Input from "../../common/components/form/Input";
import PhoneNumberField from "../../common/components/form/PhoneNumberField";
import Button from "../../common/components/button/Button";
import { mealTypes } from "@constants/mealTypes";

import type { ProfileDataType } from "../../types/user";
import { useAuthContext } from "@contexts/AuthContext";
import { Building, Gender, MealType } from "@type/enums";

import { labelMealKeys } from "@constants/rateMealKeys";
import { toTitleCase } from "@utils/stringUtils";

const UserSettings: FC = () => {
  const { user, updateUser } = useAuthContext();
  if (!user) {
    return <></>; // type safety
  }

  const [profileData, setProfileData] = useState<ProfileDataType>({
    fullName: user.name ?? "",
    gender: user.gender ?? Gender.Male,
    isVeg: user.isVeg ?? false,
    phoneNumber: user.phoneNumber ?? "",
    mealType: user.mealType ?? MealType.Full,
  });

  const [errorInName, setErrorInName] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFoodTypeChange = (isVeg: boolean) => {
    setProfileData((prev) => ({ ...prev, isVeg }));
  };

  const meal = mealTypes.find(
    (mealType) => mealType.mealType === profileData.mealType
  );

  const validateName: () => boolean = () => {
    if (profileData.fullName.trim().length === 0) {
      setErrorInName(true);
      return false;
    }
    setErrorInName(false);
    return true;
  };

  const handleSaveProfile = async () => {
    if (!user.id) return;

    if (!validateName()) return;

    const result = await updateNameAndFoodPreference(
      user.id,
      profileData.fullName.trim(),
      profileData.isVeg
    );
    if (result.status === 200) {
      // a message to user as well
      setProfileData((prev) => ({
        ...prev,
        fullName: prev.fullName.trim(),
      }));
      updateUser({
        name: profileData.fullName.trim(),
        isVeg: profileData.isVeg,
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 space-y-8 px-2">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-primary">User Settings</h1>
        <p className="text-gray-500 font-medium">
          Manage your profile and preferences
        </p>
      </header>

      <div className="bg-white rounded-2xl space-y-4">
        <h2 className="text-lg font-semibold text-primary">Profile Info</h2>
        <Input
          label="Full Name"
          name="fullName"
          value={profileData.fullName}
          onChange={handleChange}
          isError={errorInName}
          errorMessage="Your name cannot be blank"
        />

        <div className="space-y-2">
          <label className="block font-semibold text-sm text-gray-700">
            Food Preference
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleFoodTypeChange(true)}
              className={`w-full py-2 rounded-lg font-semibold transition-all ${
                profileData.isVeg
                  ? "bg-green-200 border-2 border-green-600 text-green-800"
                  : "border-2 border-white" // to prevent UI moving up and down
              }`}
            >
              Veg
            </button>
            <button
              type="button"
              onClick={() => handleFoodTypeChange(false)}
              className={`w-full py-2 rounded-lg font-semibold transition-all ${
                !profileData.isVeg
                  ? "bg-red-100 border-2 border-accent text-accent"
                  : "border-2 border-white" // to prevent UI moving up and down
              }`}
            >
              Non-Veg
            </button>
          </div>
        </div>

        <Button
          className="w-full mt-4 text-white font-semibold h-12"
          radiusSize="sm"
          onClick={handleSaveProfile}
          disabled={
            user.isVeg === profileData.isVeg &&
            user.name === profileData.fullName
          }
        >
          Save Profile
        </Button>
      </div>

      <div className="rounded-2xl space-y-4">
        <h2 className="text-lg font-semibold text-primary">Contact Info</h2>
        <PhoneNumberField
          label="Phone Number"
          name="phoneNumber"
          value={profileData.phoneNumber}
          onChange={handleChange}
        />
        <Button
          className="w-full text-white font-semibold h-12"
          radiusSize="sm"
          disabled={user.phoneNumber === profileData.phoneNumber}
        >
          Change Phone Number
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary-50 rounded-xl py-4 flex flex-col items-center">
          <span className="uppercase text-sm font-medium tracking-wide">
            {profileData.gender}
          </span>
          <Icon
            icon={
              profileData.gender === "MALE"
                ? "ion:male-sharp"
                : "ion:female-sharp"
            }
            className="text-primary size-20"
          />
        </div>

        <div className="bg-primary-50 rounded-xl py-4 flex flex-col items-center">
          <span className="uppercase text-sm font-medium tracking-wide">
            {profileData.mealType === MealType.Full
              ? "Full Day Meal"
              : `${labelMealKeys[profileData.mealType]} Only`}
          </span>
          {meal ? (
            <Icon icon={meal.icon} className="text-primary size-20" />
          ) : (
            <span className="text-xs italic text-red-400">
              Unknown meal type
            </span>
          )}
        </div>
      </div>

      {user.residentialData && (
        <div className="bg-white rounded-2xl py-6 space-y-6">
          <h2 className="text-lg font-semibold text-primary text-center">
            Stay Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <Icon
                icon="mingcute:building-2-fill"
                className="size-20 text-secondary-700"
              />
              <span className="mt-2 text-sm font-medium text-gray-500">
                Building
              </span>
              <span className="text-lg font-semibold text-primary text-center">
                {user.residentialData.building === Building.ROCKLAND_ARCADE
                  ? "Rockland Arcade"
                  : "Devi Veed"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Icon
                icon="game-icons:stairs"
                className="size-20 text-secondary-700"
              />
              <span className="mt-2 text-sm font-medium text-gray-500">
                Floor
              </span>
              <span className="text-lg font-semibold text-primary">
                {toTitleCase(user.residentialData.floor)} Floor
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings;
