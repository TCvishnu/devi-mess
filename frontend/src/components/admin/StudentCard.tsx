import { UserWithoutPassword } from "@type/user";
import { FC, HTMLAttributes } from "react";
import { toTitleCase } from "@utils/stringUtils";
import { Building, MealType } from "@type/enums";
import { Icon } from "@iconify/react/dist/iconify.js";
import { labelMealKeys } from "@constants/rateMealKeys";
import { Link } from "react-router-dom";

type StudentCardType = {
  user: UserWithoutPassword;
  isExpanded: boolean;
  maxHeight: string;
  index: number;
  onToggleExpand: (id: string) => void;
  onDelete: (user: UserWithoutPassword) => void;
} & HTMLAttributes<HTMLDivElement>;
const StudentCard: FC<StudentCardType> = ({
  user,
  isExpanded,
  maxHeight,
  index,
  onToggleExpand,
  onDelete,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`w-full border border-gray-300 rounded-md flex flex-col text-sm items-center 
    px-2 pt-2 overflow-hidden transition-all duration-1000 ease-in-out gap-2
    ${isExpanded ? maxHeight + " justify-start py-2" : "max-h-12"}`}
      key={user.id}
    >
      <div className="w-full flex">
        <div className="w-full flex gap-2 items-center px-2">
          <span className="font-medium text-gray-500 text-center w-4">
            {index + 1}.
          </span>
          <div className="w-[1.5px] h-6 bg-gray-300" />
          <span className="font-semibold text-gray-500 line-clamp-1">
            {user.name}
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <Link type="button" to={`${user.id}`}>
            <Icon icon="ic:outline-edit" className="size-6 text-gray-500" />
          </Link>
          <button type="button" onClick={() => onDelete(user)}>
            <Icon
              icon="material-symbols:delete-sharp"
              className="size-6 text-gray-500"
            />
          </button>

          <button type="button" onClick={() => onToggleExpand(user.id)}>
            <Icon
              icon="mynaui:chevron-right-solid"
              className={`text-gray-500 size-8 transform transition-transform duration-700 ease-in-out 
            ${isExpanded && "rotate-90"}`}
            />
          </button>
        </div>
      </div>

      <div className="flex w-full px-4 text-gray-400 font-medium justify-between">
        <span>{user.phoneNumber}</span>
        <span>
          {labelMealKeys[user.mealType]}{" "}
          {user.mealType === MealType.Full ? "Day Mess" : "Only"}
        </span>
      </div>

      <div className="flex w-full px-4 text-gray-400 font-medium justify-between">
        <span>{toTitleCase(user.gender)}</span>
        <span>{user.isVeg ? "Vegetarian" : "Non-Vegetarian"}</span>
      </div>

      {user.residentialData && (
        <div className="flex w-full px-4 text-gray-400 font-medium justify-between">
          <span>
            {user.residentialData.building === Building.ROCKLAND_ARCADE
              ? "Rockland Arcade"
              : "Devi Veed"}
          </span>
          <span>{toTitleCase(user.residentialData.floor)} floor</span>
        </div>
      )}
    </div>
  );
};

export default StudentCard;
