import { useState } from "react";
import Calendar from "../components/user/Calendar";
import type { FC } from "react";

const UserDashboard: FC = () => {
  const [fullName, setFullName] = useState<string>("Dummy");
  const [messCuts, setMessCuts] = useState<number[]>([10, 11, 21, 22]);

  return (
    <div className="w-screen h-screen flex flex-col p-4 bg-primary">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold">Hi!</h1>
        <button className="bg-white text-black font-semibold py-2 px-5 text-sm rounded-xs">
          Logout
        </button>
      </div>

      <h1 className="text-white text-3xl font-bold">{fullName}</h1>

      <div className="bg-white w-full h-full mt-4 rounded-md p-4 flex flex-col items-center">
        <Calendar messCuts={messCuts} />
      </div>

      <div className="bg-white w-full h-16 mt-4 rounded-md"></div>
    </div>
  );
};

export default UserDashboard;
