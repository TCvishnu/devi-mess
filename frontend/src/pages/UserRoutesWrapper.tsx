import useAuthContext from "@contexts/useAuthContext";
import { fetchCurrentUser } from "@services/userService";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const UserRoutesWrapper = () => {
  const navigate = useNavigate();

  const { user, updateUser } = useAuthContext();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        if (user) return;
        setPending(true);

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
        setPending(false);
      }
    };
    getCurrentUser();
    // this functions sets the context which only ever needs to run when page loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (pending)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white">
        <div className="size-32 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    ); // replace with a component showing loading status

  return <div className=" w-full h-auto">{user && <Outlet />}</div>;
};

export default UserRoutesWrapper;
