import { useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "../components/user/Calendar";
import type { FC } from "react";
import dayjs, { Dayjs } from "dayjs";

const UserDashboard: FC = () => {
  const [fullName, setFullName] = useState<string>("Dummy");
  const { userID } = useParams();

  if (typeof userID === "undefined") {
    // will need some redirection logic
    return;
  }

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
        <Calendar userID={userID} />
      </div>

      <div className="bg-white w-full h-16 mt-4 rounded-md"></div>
    </div>
  );
};

export default UserDashboard;
