import { ChangeEvent, FormEvent, useState } from "react";
import Button from "../../../common/components/button/Button";
import { ProfileCompleteFormData } from "@type/user";
import { Gender, MealType, UserRole } from "@type/enums";
import SelectBox from "@form/Select";
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

    // console.log(formData)
    onSubmit(event, formData);
  };

  return (
    <form className=" w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <SelectBox.Select
        name="gender"
        label="Gender"
        onChange={handleChange}
        value={formData.gender}
      >
        <SelectBox.Option value={Gender.Male}>Male</SelectBox.Option>
        <SelectBox.Option value={Gender.Female}>Female</SelectBox.Option>
      </SelectBox.Select>

      <SelectBox.Select
        name="mealType"
        label="Meal Selection"
        onChange={handleChange}
        value={formData.mealType}
      >
        <SelectBox.Option value={MealType.Full}>Full day</SelectBox.Option>
        {formData.gender == Gender.Female && (
          <>
            <SelectBox.Option value={MealType.Morning}>
              Morning
            </SelectBox.Option>
            <SelectBox.Option value={MealType.Afternoon}>
              Afternoon
            </SelectBox.Option>
            <SelectBox.Option value={MealType.Evening}>
              Evening
            </SelectBox.Option>
          </>
        )}
      </SelectBox.Select>

      <SelectBox.Select
        name="role"
        label="Type"
        onChange={handleChange}
        value={formData.role}
      >
        <SelectBox.Option value={UserRole.Mess}>Mess</SelectBox.Option>
        {formData.gender === Gender.Male && (
          <SelectBox.Option value={UserRole.Resident}>
            Resident
          </SelectBox.Option>
        )}
      </SelectBox.Select>

      {formData.role == UserRole.Resident && (
        <>
          <SelectBox.Select
            name="building"
            label="Recident place"
            onChange={handleResidentChange}
            value={formData.residentialData?.building}
            required
          >
            <SelectBox.Option value="">Select a type</SelectBox.Option>
            <SelectBox.Option value="DEVI_HOUSE">Devi house</SelectBox.Option>
            <SelectBox.Option value="ROCKLAND_ARCADE">
              Rockland arcade
            </SelectBox.Option>
          </SelectBox.Select>

          <SelectBox.Select
            name="floor"
            label="Recident place"
            onChange={handleResidentChange}
            value={formData.residentialData?.floor}
            required
          >
            <SelectBox.Option value="">Select a floor</SelectBox.Option>
            {formData.residentialData?.building === "ROCKLAND_ARCADE" && (
              <SelectBox.Option value="GROUND">Ground floor</SelectBox.Option>
            )}
            <SelectBox.Option value="TOP">Top floor</SelectBox.Option>
          </SelectBox.Select>
        </>
      )}

      <div className="w-full flex flex-col gap-1">
        <label className=" font-semibold opacity-60 flex items-center gap-1">
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
        className=" mt-4 flex justify-center items-center"
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
