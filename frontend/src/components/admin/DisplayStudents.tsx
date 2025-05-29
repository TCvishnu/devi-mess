import { FC, useEffect, useState } from "react";
import type { UserWithoutPassword } from "@type/user";
import { Icon } from "@iconify/react/dist/iconify.js";

import { toTitleCase } from "@utils/stringUtils";
import { MealType } from "@type/enums";

import { getResidents, getMessStudents } from "@services/verifiedUserService";

const DisplayStudents: FC = () => {
  const [displayResidents, setDisplayResidents] = useState<boolean>(true);
  const [magnifiedUsers, setMagnifiedUsers] = useState<Set<string>>(new Set());

  const [students, setStudents] = useState<UserWithoutPassword[]>([]);

  const toggleMagnifiedUsers = (userID: string) => {
    setMagnifiedUsers((prev) => {
      const modifiedUsers = new Set(prev);
      if (modifiedUsers.has(userID)) {
        modifiedUsers.delete(userID);
      } else {
        modifiedUsers.add(userID);
      }
      return modifiedUsers;
    });
  };

  const showResidents = () => {
    setDisplayResidents(true);
    setMagnifiedUsers(new Set());
  };
  const showMessStudents = () => {
    setDisplayResidents(false);
    setMagnifiedUsers(new Set());
  };

  const fetchAllResidents = async () => {
    const result = await getResidents();

    if (result.status === 200) {
      setStudents(result.residents);
    }
    // error message
  };

  const fetchAllMessStudents = async () => {
    const result = await getMessStudents();
    if (result.status === 200) {
      setStudents(result.messStudents);
    }
  };

  useEffect(() => {
    if (displayResidents) {
      fetchAllResidents();
    } else {
      fetchAllMessStudents();
    }
  }, [displayResidents]);

  return (
    <div className="w-full flex flex-col gap-4 py-6 h-full">
      <div className="w-full min-h-12 border border-gray-400 flex items-center rounded-sm gap-2 px-2">
        <Icon icon="uil:search" className="size-6 text-gray-500" />
        <div className="w-[1.5px] h-6 bg-gray-400" />
        <input
          className="h-full w-full outline-none text-sm font-medium placeholder:text-gray-300"
          placeholder="Search.."
        />
      </div>

      <div className="flex w-full justify-between">
        <button
          className={`w-32 h-10 font-semibold text-sm rounded-xs xs:w-40 ${
            displayResidents ? "bg-accent text-white" : "border border-gray-400"
          }`}
          onClick={showResidents}
        >
          Residents
        </button>
        <button
          className={`w-32 h-10 font-semibold text-sm rounded-xs xs:w-40 ${
            !displayResidents
              ? "bg-accent text-white"
              : "border border-gray-400"
          }`}
          onClick={showMessStudents}
        >
          Mess
        </button>
      </div>

      <div className="overflow-y-auto">
        <div className="w-full flex gap-2 flex-col">
          {students.map((user, index) => {
            const isExpanded = magnifiedUsers.has(user.id);
            const hasData = !!user.residentialData;
            const maxHeight = hasData ? "max-h-40" : "max-h-32";

            return (
              <div
                className={`w-full border border-gray-300 rounded-md flex flex-col text-sm items-center 
                  px-2 pt-2 overflow-hidden transition-all duration-1000 ease-in-out gap-2
                  ${
                    isExpanded ? maxHeight + " justify-start py-2" : "max-h-12"
                  }`}
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
                  <button onClick={() => toggleMagnifiedUsers(user.id)}>
                    <Icon
                      icon="mynaui:chevron-right-solid"
                      className={`text-gray-500 size-8 transform transition-transform duration-700 ease-in-out 
              ${isExpanded && "rotate-90"}`}
                    />
                  </button>
                </div>

                <div className="flex w-full px-4 text-gray-400 font-medium justify-between">
                  <span>{user.phoneNumber}</span>
                  <span>
                    {toTitleCase(user.mealType)}{" "}
                    {user.mealType === MealType.Full ? "Day Mess" : "Only"}
                  </span>
                </div>

                <div className="flex w-full px-4 text-gray-400 font-medium justify-between">
                  <span>{toTitleCase(user.gender)}</span>
                  <span>{user.isVeg ? "Vegetarian" : "Non-Vegetarian"}</span>
                </div>

                {user.residentialData && (
                  <div className="flex w-full px-4 text-gray-400 font-medium justify-between">
                    <span>{user.residentialData.building}</span>
                    <span>{user.residentialData.floor}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default DisplayStudents;
