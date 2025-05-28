import { FC, useEffect } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useAuthContext } from "@contexts/AuthContext";

const UserLayout: FC = () => {
  const { user } = useAuthContext();
  const { userID } = useParams();
  const navigate = useNavigate();

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

  return (
    <div className="w-screen h-screen flex flex-col p-4 bg-primary">
      <div className="w-full flex justify-between">
        <h1 className="text-white text-3xl font-bold">Hi!</h1>
        <button className="bg-white text-black font-semibold py-2 px-5 text-sm rounded-xs">
          Logout
        </button>
      </div>
      <h1 className="text-white text-3xl font-bold">{user?.name}</h1>
      <NavBar />
      <div className="bg-white w-full h-full mt-4 rounded-md px-4 flex flex-col items-center overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
