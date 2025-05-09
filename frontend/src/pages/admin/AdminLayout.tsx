import type { FC } from "react";
import { useState } from "react";

import DatePicker from "@components/admin/DatePicker";
import AdminDashboard from "./AdminDashboard";
import { DateContextProvider } from "@contexts/DateContext";

const AdminLayout: FC = () => {
  const [fullName] = useState<string>("Santhosh Kumar");
  return (
    <div className="w-screen h-screen flex flex-col p-4 bg-primary overflow-y-auto">
      <div className="w-full flex justify-between">
        <h1 className="text-white text-3xl font-bold">Hi!</h1>
        <button className="bg-white text-black font-semibold py-2 px-5 text-sm rounded-xs">
          Logout
        </button>
      </div>

      <h1 className="text-white text-3xl font-bold">{fullName}</h1>
      <DateContextProvider>
        <DatePicker />
        <AdminDashboard />
      </DateContextProvider>
    </div>
  );
};

export default AdminLayout;
