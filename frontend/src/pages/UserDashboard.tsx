import Calendar from "../components/user/Calendar";
import type { FC } from "react";

const UserDashboard: FC = () => {
  return (
    <div className="bg-white w-full h-full mt-4 rounded-md p-4 flex flex-col items-center">
      <Calendar />
    </div>
  );
};

export default UserDashboard;
