import { useState, FC } from "react";
import FoodCountDisplay from "@components/admin/FoodCountDisplay";
import UserReport from "@components/admin/UserReport";

const AdminDashboard: FC = () => {
  const [showStatistics, setShowStatistics] = useState<boolean>(true);
  const displayStatistics = () => setShowStatistics(true);
  const displayStudents = () => setShowStatistics(false);
  return (
    <div className=" w-full bg-white h-full rounded-xs flex flex-col overflow-y-auto p-4">
      <div className="w-full flex justify-evenly">
        <button
          onClick={displayStatistics}
          className={` font-medium tab-underline ${
            showStatistics
              ? " text-gray-700 tab-underline-active"
              : " text-gray-500"
          }`}
        >
          Statistics
        </button>

        <button
          onClick={displayStudents}
          className={` font-medium tab-underline ${
            !showStatistics
              ? " text-gray-700 tab-underline-active"
              : " text-gray-500"
          }`}
        >
          Students
        </button>
      </div>

      {showStatistics && (
        <>
          <FoodCountDisplay />
          <UserReport />
        </>
      )}
    </div>
  );
};
export default AdminDashboard;
