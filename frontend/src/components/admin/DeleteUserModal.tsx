import { Icon } from "@iconify/react/dist/iconify.js";
import { UserWithoutPassword } from "@type/user";
import { deleteUserByUserID } from "@services/userService";
import { useState } from "react";

type DeleteUserModalType = {
  onCancelDelete: (deleted: boolean) => void;
  deleteUserData: UserWithoutPassword;
};
const DeleteUserModal = ({
  onCancelDelete,
  deleteUserData,
}: DeleteUserModalType) => {
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "deleting" | "success"
  >("idle");

  const proceedAndDelete = async () => {
    setDeleteStatus("deleting");
    const { status } = await deleteUserByUserID(deleteUserData.id);
    if (status) {
      setTimeout(() => setDeleteStatus("success"), 1000);
    }
    setTimeout(() => onCancelDelete(true), 2000);
  };
  return (
    <div className="inset-0 fixed z-50 w-screen h-screen bg-blur flex items-center justify-center">
      <div className="bg-white rounded-md shadow-xl p-6 w-[90%] max-w-md text-center space-y-6">
        <div className="flex flex-col items-center">
          <Icon icon="si:warning-duotone" className=" size-12 text-accent" />
          <h2 className="text-xl font-semibold text-primary mt-4">
            Delete User?
          </h2>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-bold">
              {deleteUserData.name + " (" + deleteUserData.phoneNumber + ")"}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            disabled={deleteStatus !== "idle"}
            onClick={proceedAndDelete}
            className="bg-accent text-white font-semibold px-5 py-2 rounded-lg shadow-sm transition"
          >
            {deleteStatus === "idle" && "Yes, Delete"}
            {deleteStatus === "deleting" && (
              <Icon icon="line-md:loading-loop" className=" size-6" />
            )}
            {deleteStatus === "success" && (
              <Icon icon="typcn:tick" className=" size-6" />
            )}
          </button>
          <button
            onClick={() => onCancelDelete(false)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-5 py-2 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteUserModal;
