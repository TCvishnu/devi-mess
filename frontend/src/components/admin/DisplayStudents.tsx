import { FC, useState } from "react";
import type { User } from "types/user";
import { Icon } from "@iconify/react/dist/iconify.js";

import { toTitleCase } from "@utils/stringUtils";
// to be removed
const dummyMessUsers: User[] = [
  {
    id: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Jishnu Menon",
    phoneNumber: "9876543210",
    password: "hashedpassword1",
    gender: "MALE",
    mealType: "Full",
    role: "MESS",
    isVeg: false,
    hasOnboarded: true,
    adminVerified: true,
    messcuts: [],
  },
  {
    id: "user2",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Vignesh Rao",
    phoneNumber: "9123456780",
    password: "hashedpassword2",
    gender: "MALE",
    mealType: "Full",
    role: "MESS",
    isVeg: true,
    hasOnboarded: true,
    adminVerified: true,
    messcuts: [],
  },
  {
    id: "user3",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Amit Sharma",
    phoneNumber: "9012345678",
    password: "hashedpassword3",
    gender: "MALE",
    mealType: "Full",
    role: "MESS",
    isVeg: true,
    hasOnboarded: true,
    adminVerified: true,
    messcuts: [],
  },
  {
    id: "user4",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Priya Singh",
    phoneNumber: "9988776655",
    password: "hashedpassword4",
    gender: "FEMALE",
    mealType: "Afternoon",
    role: "MESS",
    isVeg: false,
    hasOnboarded: true,
    adminVerified: true,
    messcuts: [],
  },
];

const dummyResidents: User[] = [
  {
    id: "resident1",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Ananya Iyer",
    phoneNumber: "9876543210",
    password: "hashedpassword1",
    gender: "FEMALE",
    mealType: "Full",
    role: "RESIDENT",
    isVeg: false,
    hasOnboarded: true,
    adminVerified: true,
    messcuts: [],
  },
  {
    id: "resident2",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Rohit Mehta",
    phoneNumber: "9123456780",
    password: "hashedpassword2",
    gender: "MALE",
    mealType: "Full",
    role: "RESIDENT",
    isVeg: true,
    hasOnboarded: true,
    adminVerified: true,
    messcuts: [],
  },
  {
    id: "resident3",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Sneha Deshpande",
    phoneNumber: "9012345678",
    password: "hashedpassword3",
    gender: "FEMALE",
    mealType: "Full",
    role: "RESIDENT",
    isVeg: true,
    hasOnboarded: true,
    adminVerified: true,
    messcuts: [],
  },
  {
    id: "resident4",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Karthik Nair",
    phoneNumber: "9988776655",
    password: "hashedpassword4",
    gender: "MALE",
    mealType: "Afternoon",
    role: "RESIDENT",
    isVeg: false,
    hasOnboarded: true,
    adminVerified: true,
    messcuts: [],
  },
];

const DisplayStudents: FC = () => {
  const [displayResidents, setDisplayResidents] = useState<boolean>(true);
  const [magnifiedUsers, setMagnifiedUsers] = useState<Set<string>>(new Set());

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
          {(displayResidents ? dummyResidents : dummyMessUsers).map(
            (user, index) => (
              <div
                className={`w-full border border-gray-300 rounded-md flex flex-col text-sm items-center 
              px-2 pt-2 overflow-hidden transition-all duration-1000 gap-2
              ${
                magnifiedUsers.has(user.id) ? "h-28 justify-start py-2" : "h-12"
              }`}
                key={user.id}
              >
                <div className="w-full flex">
                  <div className="w-full flex gap-2 items-center px-2">
                    <span className="font-medium text-gray-500 text-center">
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
                      className={`text-gray-500 size-8 transform transition-transform duration-1000 ease-in-out 
                  ${magnifiedUsers.has(user.id) && " rotate-90"}`}
                    />
                  </button>
                </div>
                <div className="flex w-full px-4 text-gray-400 font-medium justify-between">
                  <span>{user.phoneNumber}</span>
                  <span>
                    {user.mealType}{" "}
                    {user.mealType === "Full" ? "Day Mess" : "Only"}
                  </span>
                </div>
                <div className="flex w-full px-4 text-gray-400 font-medium justify-between">
                  <span>{toTitleCase(user.gender)}</span>
                  <span>{user.isVeg ? "Vegetarian" : "Non-Vegetarian"}</span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
export default DisplayStudents;
