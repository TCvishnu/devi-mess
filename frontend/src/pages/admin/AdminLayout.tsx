import type { FC } from "react";
import { useEffect, useState } from "react";

import DatePicker from "@components/admin/DatePicker";
import AdminDashboard from "./AdminDashboard";
import { DateContextProvider } from "@contexts/DateContext";
import { useAuthContext } from "@contexts/AuthContext";
import { fetchCurrentUser } from "@services/userService";
import { useNavigate } from "react-router-dom";

const AdminLayout: FC = () => {
  const { user, login: updateUser } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      if (user) return;
      const { data, error } = await fetchCurrentUser();

      if (!error && data) {
        updateUser(data);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white">
        <div
          className="size-32 border-4 border-primary border-t-transparent
          rounded-full animate-spin drop-shadow-lg"
        />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col p-4 bg-primary overflow-y-auto">
      <div className="w-full flex justify-between">
        <h1 className="text-white text-3xl font-bold">Hi!</h1>
        <button className="bg-white text-black font-semibold py-2 px-5 text-sm rounded-xs">
          Logout
        </button>
      </div>

      <h1 className="text-white text-3xl font-bold">{user?.name}</h1>
      {user && (
        <DateContextProvider>
          <DatePicker />
          <AdminDashboard />
        </DateContextProvider>
      )}
    </div>
  );
};

export default AdminLayout;
