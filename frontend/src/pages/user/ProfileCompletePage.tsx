import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import ProfileCompleteForm from "../../components/user/form/ProfileCompleteForm";
import { ProfileCompleteFormData } from "@type/user";
import { saveProfile } from "@services/userService";
import useAuthContext from "../../contexts/useAuthContext";
import { UserRole } from "@type/enums";

const ProfileCompletePage = () => {
  const navigate = useNavigate();

  const { user, updateUser } = useAuthContext();

  const [pending, setPending] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | undefined>("");

  const handleSubmit = async (formData: ProfileCompleteFormData) => {
    try {
      setPending(true);
      const { data, error } = await saveProfile({ ...formData });

      if (!error && data) {
        updateUser({ ...formData, hasOnboarded: true });
        navigate(`/user/${data.id}`);
        setErrorMessage("");
      } else {
        setErrorMessage(error);
      }
    } catch (err: unknown) {
      if (err instanceof Error) console.log(err.message);
      setErrorMessage("Something went wrong. Please try again later");
    } finally {
      setPending(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  useEffect(() => {
    if (user?.hasOnboarded) {
      navigate(`/user/${user.id}`);
    } else if (user?.role === UserRole.Admin) {
      navigate("/admin");
    }
  }, [navigate, user?.hasOnboarded, user?.role, user?.id]);

  return (
    <div className=" px-6 py-4 min-h-dvh flex flex-col gap-10 justify-between">
      <div className=" space-y-4">
        <div className=" py-2 font-bold">
          <Icon
            onClick={handleGoBack}
            icon="famicons:arrow-back"
            width={24}
            className=" text-gray-400"
          />
          <h2 className=" mt-10 text-2xl sm:text-2xl">
            Welcome Back, {user?.name || ""}
          </h2>
          <p className=" mt-6 text-base sm:text-lg opacity-40 ">
            You're two steps away from unlocking your personalized dashboard!
          </p>
        </div>

        <div>
          {errorMessage && (
            <span className=" text-red-600 font-medium opacity-50 ">
              {errorMessage}
            </span>
          )}
          <ProfileCompleteForm
            onSubmit={handleSubmit}
            disable={pending}
            pending={pending}
          />
        </div>
      </div>
      <div className=" text-center font-bold opacity-60">
        <span>Devi Mess</span>
      </div>
    </div>
  );
};

export default ProfileCompletePage;
