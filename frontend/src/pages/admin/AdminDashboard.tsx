import { useState, FC, useEffect } from "react";
import FoodCountDisplay from "@components/admin/FoodCountDisplay";
import DisplayStudents from "@components/admin/DisplayStudents";
import UserReport from "@components/admin/UserReport";
import AdminSettings from "@components/admin/AdminSettings";

const navbar = ["Count", "Students", "Report", "Settings"] as const;
type Page = "Count" | "Students" | "Report" | "Settings";

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
  }, [curPage]);

  return (
    <div className=" w-full bg-white h-full rounded-xs flex flex-col overflow-y-auto p-4">
      <div className="w-full flex justify-evenly">
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
      {curPage === "Settings" && <AdminSettings />}
    </div>
  );
};
export default AdminDashboard;
