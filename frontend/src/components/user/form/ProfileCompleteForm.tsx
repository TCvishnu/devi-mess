import { ChangeEvent, FormEvent, useState } from "react";
import Button from "../../../common/components/button/Button";
import { ProfileCompleteFormData } from "@type/user";
import { Gender, MealType, UserRole } from "@type/enums";
import { Select, Option } from "@form/Select";
import CheckBox from "@form/Checkbox";
import { Icon } from "@iconify/react";

type ProfileCompleteFormProps = {
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
    formData: ProfileCompleteFormData
  ) => void;
  disable?: boolean;
  pending?: boolean;
};

const ProfileCompleteForm: React.FC<ProfileCompleteFormProps> = ({
  onSubmit,
  disable = false,
  pending = false,
}) => {
  const now = new Date();
  const tomorrow = new Date(now.setDate(now.getDate() + 1));
  const minDate = tomorrow.toISOString().split("T")[0];

  const [formData, setFormData] = useState<ProfileCompleteFormData>({
    gender: Gender.Male,
    mealType: MealType.Full,
    role: UserRole.Mess,
    isVeg: false,
    residentialData: {
      floor: "TOP",
      building: "DEVI_HOUSE",
    },
    startDate: minDate,
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const checked = (event.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      mealType:
        name === "gender" && value == Gender.Male
          ? MealType.Full
          : prev.mealType,
      role:
        name === "gender" && value == Gender.Female ? UserRole.Mess : prev.role,
      residentialData:
        (name === "role" && value === UserRole.Mess) ||
        (name === "gender" && value === Gender.Female)
          ? undefined
          : prev.residentialData,
      [name]: name === "isVeg" ? checked : value,
      startDate:
        name === "startDate"
          ? value.localeCompare(prev.startDate as string) === -1
            ? prev.startDate
            : value
          : prev.startDate,
    }));
  };

  const handleResidentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      residentialData: {
        ...(prev.residentialData || {
          building: "DEVI_HOUSE",
          floor: "TOP",
        }),
        [name]: value,
      },
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(event, formData);
  };

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <Select
        name="gender"
        label="Gender"
        onChange={handleChange}
        value={formData.gender}
      >
        <Option value={Gender.Male}>Male</Option>
        <Option value={Gender.Female}>Female</Option>
      </Select>

      <Select
        name="mealType"
        label="Meal Selection"
        onChange={handleChange}
        value={formData.mealType}
      >
        <Option value={MealType.Full}>Full day</Option>
        {formData.gender === Gender.Female && (
          <>
            <Option value={MealType.Morning}>Morning</Option>
            <Option value={MealType.Afternoon}>Afternoon</Option>
            <Option value={MealType.Evening}>Evening</Option>
          </>
        )}
      </Select>

      <Select
        name="role"
        label="Type"
        onChange={handleChange}
        value={formData.role}
      >
        <Option value={UserRole.Mess}>Mess</Option>
        {formData.gender === Gender.Male && (
          <Option value={UserRole.Resident}>Resident</Option>
        )}
      </Select>

      {formData.role === UserRole.Resident && (
        <>
          <Select
            name="building"
            label="Resident Place"
            onChange={handleResidentChange}
            value={formData.residentialData?.building}
            required
          >
            <Option value="">Select a type</Option>
            <Option value="DEVI_HOUSE">Devi House</Option>
            <Option value="ROCKLAND_ARCADE">Rockland Arcade</Option>
          </Select>

          <Select
            name="floor"
            label="Resident Floor"
            onChange={handleResidentChange}
            value={formData.residentialData?.floor}
            required
          >
            <Option value="">Select a floor</Option>
            {formData.residentialData?.building === "ROCKLAND_ARCADE" && (
              <Option value="GROUND">Ground Floor</Option>
            )}
            <Option value="TOP">Top Floor</Option>
          </Select>
        </>
      )}

      <div className="w-full flex flex-col gap-1">
        <label className="font-semibold opacity-60 flex items-center gap-1">
          Mess Start Date
          <span className="text-xs text-primary"> (from tomorrow only)</span>
        </label>
        <input
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          min={minDate}
          className="px-4 py-2 rounded-lg border border-neutral-400 shadow-sm text-gray-700 bg-neutral-100 outline-none"
        />
      </div>

      <CheckBox
        name="isVeg"
        label="Is vegetarian?"
        onChange={handleChange}
        checked={formData.isVeg}
      />

      <Button
        className="mt-4 flex justify-center items-center"
        disabled={disable}
      >
        {pending ? (
          <Icon width={24} color="white" icon="eos-icons:loading" />
        ) : (
          "Complete"
        )}
      </Button>
    </form>
  );
};

export default ProfileCompleteForm;
