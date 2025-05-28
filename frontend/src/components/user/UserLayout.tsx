import { FC, useEffect, useState } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useAuthContext } from "@contexts/AuthContext";
import { logoutUser } from "@services/authService";

const UserLayout: FC = () => {
  const { user, logout } = useAuthContext();
  const { userID } = useParams();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!user) {
      // type safety
      navigate("/");
      return;
    }
    if (user.id !== userID) {
      // user tries to access some other user content
      navigate(`/user/${user.id}`);
      return;
    }
    if (!user.hasOnboarded) {
      navigate("/complete-profile");
      return;
    }
    if (!user.adminVerified) {
      navigate("/waiting-for-verification");
      return;
    }
  }, [user, userID, navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const status = await logoutUser();
    if (status === 200) {
      logout();
      navigate("/");
    }
    setIsLoggingOut(false);
  };

  return (
    <div className="w-screen h-screen flex flex-col p-4 bg-primary">
      <div className="w-full flex justify-between">
        <h1 className="text-white text-3xl font-bold">Hi!</h1>
        <button
          className="bg-white text-black font-semibold py-2 px-5 text-sm rounded-xs"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <h1 className="text-white text-3xl font-bold">{user?.name}</h1>
      <NavBar />
      <div className="bg-white w-full h-full mt-4 rounded-md px-4 flex flex-col items-center overflow-y-auto">
        <Outlet />
      </div>

      {isLoggingOut && (
        <>
          <div className="fixed inset-0 backdrop-blur-[1.5px] z-40" />
          <div className="fixed right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 size-32 border-4 border-primary border-t-transparent rounded-full animate-spin z-50" />
        </>
      )}
    </div>
  );
};

export default UserLayout;
