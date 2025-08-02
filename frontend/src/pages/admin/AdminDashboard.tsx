import { useState, FC, useEffect } from "react";
import FoodCountDisplay from "@components/admin/FoodCountDisplay";
import DisplayStudents from "@components/admin/DisplayStudents";
import UserReport from "@components/admin/UserReport";
import UserVerificationList from "@components/admin/UserVerificationList";
import AdminSettings from "@components/admin/AdminSettings";
import AdminCalendar from "@components/admin/AdminCalendar";

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
      {curPage === "Verify" && <UserVerificationList />}
      {curPage === "Settings" && <AdminSettings />}
      {curPage === "Calendar" && <AdminCalendar />}
    </div>
  );
};

type NavBarType = {
  curPage: Page;
  changePage: (page: Page) => void;
};

function NavBar({ curPage, changePage }: NavBarType) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="w-full">
      {/* Menu toggle button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
        >
          {showMenu ? "Close Menu" : "Menu"}
        </button>
      </div>

      {/* Navigation buttons */}
      {showMenu && (
        <div className="w-full flex justify-evenly flex-wrap gap-4">
          {navbar.map((page) => (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={`font-medium tab-underline ${
                curPage === page
                  ? "text-gray-700 tab-underline-active"
                  : "text-gray-500"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
