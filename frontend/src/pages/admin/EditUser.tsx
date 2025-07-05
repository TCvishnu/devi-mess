import { useEffect } from "react";
import { fetchCurrentUser } from "@services/userService";
import useAuthContext from "@contexts/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { UserRole } from "@type/enums";

const EditUser = () => {
  const { user, updateUser } = useAuthContext();
  const navigate = useNavigate();
  const { userID } = useParams();

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
      }
    };

    getCurrentUser();
  }, [navigate, updateUser, user]);

  return (
    <div className="w-full max-w-2xl mx-auto py-6 space-y-8 px-2">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-primary">Edit User</h1>
        <p className="text-gray-500 font-medium">
          Manage the User's profile and preferences
        </p>
      </header>
    </div>
  );
};
export default EditUser;
