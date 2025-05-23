import type { FC } from "react";

import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { useState } from "react";

const UserLayout: FC = () => {
  const [fullName] = useState<string>("Dummy");
  return (
    <div className="w-screen h-screen flex flex-col p-4 bg-primary">
      <div className="w-full flex justify-between">
        <h1 className="text-white text-3xl font-bold">Hi!</h1>
        <button className="bg-white text-black font-semibold py-2 px-5 text-sm rounded-xs">
          Logout
        </button>
      </div>

      <h1 className="text-white text-3xl font-bold">{fullName}</h1>
      <NavBar />
      <div className="bg-white w-full h-full mt-4 rounded-md px-4 flex flex-col items-center overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
