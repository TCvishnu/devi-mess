import { useEffect, useState, ChangeEvent } from "react";
import {
  fetchCurrentUser,
  fetchUserByID,
  updateUserMealType,
} from "@services/userService";
import useAuthContext from "@contexts/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { Gender, MealType, UserRole } from "@type/enums";
import { User } from "@type/user";
import Input from "@form/Input";
import Button from "../../common/components/button/Button";
import { mealTypes } from "@constants/mealTypes";
import MealTypeButton from "@components/user/MealTypeButton";

const EditUser = () => {
  const [userToEdit, setUserToEdit] = useState<User>();
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const { user, updateUser } = useAuthContext();
  const navigate = useNavigate();
  const { userID } = useParams();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserToEdit((prev) => ({ ...(prev as User), [name]: value }));
  };

  const handleFoodTypeChange = (isVeg: boolean) => {
    setUserToEdit((prev) => {
      return { ...(prev as User), isVeg };
    });
  };

  const handleMealTypeUpdate = async (mealType: MealType) => {
    if (!userToEdit) return;

    const result = await updateUserMealType(
      mealType,
      userToEdit.gender,
      userToEdit.id
    );

    if (result.status === 200) {
      setUserToEdit((prev) => ({ ...(prev as User), mealType }));
    }
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
      }
    };

    getCurrentUser();
  }, [navigate, updateUser, user]);

  const fetchUserToEdit = async () => {
    if (!userID) return;

    const { student, error } = await fetchUserByID(userID);
    if (error) return;

    setUserToEdit(student);
    setPhoneNumber(student.phoneNumber);
  };

  useEffect(() => {
    fetchUserToEdit();
  }, []);

  if (!userToEdit) return;

  return (
    <div className="w-full max-w-2xl mx-auto py-6 space-y-8 px-4">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-primary">Edit User</h1>
        <p className="text-gray-500 font-medium">
          Manage the User's profile and preferences
        </p>
      </header>

      <div className="bg-white rounded-2xl space-y-4">
        <h2 className="text-lg font-semibold text-primary">Profile Info</h2>
        <Input
          label="Full Name"
          name="name"
          value={userToEdit.name}
          onChange={handleChange}
          errorMessage="Your name cannot be blank"
        />

        <div className="space-y-2">
          <label className="block font-semibold text-sm text-gray-700">
            Food Preference
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleFoodTypeChange(true)}
              className={`w-full py-2 rounded-lg font-semibold transition-all ${
                userToEdit.isVeg
                  ? "bg-green-200 border-2 border-green-600 text-green-800"
                  : "border-2 border-white" // to prevent UI moving up and down
              }`}
            >
              Veg
            </button>
            <button
              type="button"
              onClick={() => handleFoodTypeChange(false)}
              className={`w-full py-2 rounded-lg font-semibold transition-all ${
                !userToEdit.isVeg
                  ? "bg-red-100 border-2 border-accent text-accent"
                  : "border-2 border-white" // to prevent UI moving up and down
              }`}
            >
              Non-Veg
            </button>
          </div>
        </div>

        <Button
          className="w-full mt-4 text-white font-semibold h-12"
          radiusSize="sm"
        >
          Save Changes
        </Button>
      </div>

      <Input
        label="Phone Number"
        name="phoneNumber"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        errorMessage="Your name cannot be blank"
      />
      <Button className="w-full text-white font-semibold h-12" radiusSize="sm">
        Save Phone Number
      </Button>

      <div className="space-y-4">
        <h2 className="font-semibold text-gray-600">Meal Plan</h2>
        <div className="flex flex-wrap w-full justify-between">
          {mealTypes.map((mealType) => (
            <MealTypeButton
              key={mealType.mealType}
              mealType={mealType.mealType}
              selectedMealType={userToEdit.mealType}
              icon={mealType.icon}
              disabled={userToEdit.gender === Gender.Male}
              onClick={() => handleMealTypeUpdate(mealType.mealType)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default EditUser;
