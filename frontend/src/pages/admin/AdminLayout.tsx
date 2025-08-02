import type { FC } from "react";
import { useEffect, useState } from "react";

import DatePicker from "@components/admin/DatePicker";
import AdminDashboard from "./AdminDashboard";
import { DateContextProvider } from "@contexts/DateContextProvider";
import useAuthContext from "@contexts/useAuthContext";
import { fetchCurrentUser } from "@services/userService";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@services/authService";
import { UserRole } from "@type/enums";

const AdminLayout: FC = () => {
  const { user, login: updateUser, logout } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [allowDateChanging, setAllowDateChanging] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();

  const handleToggleDateChanging = (allow: boolean) => {
    setAllowDateChanging(allow);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const status = await logoutUser();
    if (status === 200) {
      logout();
      navigate("/");
    }
    setIsLoggingOut(false);
  };

  const handleRegister = () => {
    navigate("/admin/register");
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        if (user) return;
        const { data, error } = await fetchCurrentUser();

        if (!error && data) {
          updateUser(data);
          if (data.role !== UserRole.Admin) {
            navigate(`/user/${data.id}`);
          }
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

    getCurrentUser();
  }, [navigate, updateUser, user]);

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
        <button
          className="bg-white text-black font-semibold py-2 px-5 text-sm rounded-xs"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className=" flex justify-between mt-2">
        <h1 className="text-white text-3xl font-bold">{user?.name}</h1>
        <button
          className="bg-accent text-white font-semibold py-2 px-5 text-sm rounded-xs cursor-pointer"
          onClick={handleRegister}
        >
          Register
        </button>
      </div>

      {user && (
        <DateContextProvider>
          <DatePicker allowDateChanging={allowDateChanging} />
          <AdminDashboard onToggleDateChanging={handleToggleDateChanging} />
        </DateContextProvider>
      )}

      {isLoggingOut && (
        <>
          <div className="fixed inset-0 backdrop-blur-[1.5px] z-40" />
          <div className="fixed right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 size-32 border-4 border-primary border-t-transparent rounded-full animate-spin z-50" />
        </>
      )}
    </div>
  );
};

export default AdminLayout;
