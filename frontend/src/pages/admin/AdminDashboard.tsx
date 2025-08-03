import { useState, FC, useEffect } from "react";
import FoodCountDisplay from "@components/admin/FoodCountDisplay";
import DisplayStudents from "@components/admin/DisplayStudents";
import UserReport from "@components/admin/UserReport";
import AdminSettings from "@components/admin/AdminSettings";
import AdminCalendar from "@components/admin/AdminCalendar";
import MessCutVerification from "@components/admin/MessCutVerification";

const navbar = [
  "Count",
  "Students",
  "Report",
  "Verify",
  "Calendar",
  "Settings",
] as const;
type Page =
  | "Count"
  | "Students"
  | "Report"
  | "Settings"
  | "Verify"
  | "Calendar";

type AdminDashboardType = {
  onToggleDateChanging: (allow: boolean) => void;
};
const AdminDashboard: FC<AdminDashboardType> = ({ onToggleDateChanging }) => {
  const [curPage, setCurPage] = useState<Page>("Count");

  const changePage = (page: Page) => {
    setCurPage(page);
  };

  useEffect(() => {
    onToggleDateChanging(curPage === "Count");
  }, [curPage, onToggleDateChanging]);

  return (
    <div className=" w-full bg-white h-full rounded-xs flex flex-col overflow-y-auto p-4">
      <div className="w-full flex justify-evenly flex-wrap gap-x-4 gap-y-2">
        {navbar.map((page) => (
          <button
            key={page}
            onClick={() => changePage(page)}
            className={` font-medium tab-underline ${
              curPage === page
                ? " text-gray-700 tab-underline-active"
                : " text-gray-500"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      {curPage === "Count" && <FoodCountDisplay />}
      {curPage === "Students" && <DisplayStudents />}
      {curPage === "Report" && <UserReport />}
      {curPage === "Verify" && <MessCutVerification />}
      {curPage === "Settings" && <AdminSettings />}
      {curPage === "Calendar" && <AdminCalendar />}
    </div>
  );
};

export default AdminDashboard;
