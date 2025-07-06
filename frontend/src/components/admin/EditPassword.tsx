import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { updatePassword } from "@services/userService";

type EditPasswordType = {
  userID: string;
};

const EditPassword = ({ userID }: EditPasswordType) => {
  const [editing, setEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await updatePassword(userID, newPassword);
      if (result.status === 200) {
        setTimeout(() => setSuccess("Password updated successfully!"), 1000);
      }
      setNewPassword("");
    } catch (err) {
      setError("Failed to update password.");
    } finally {
      setTimeout(() => {
        setSuccess("");
        setLoading(false);
        setEditing(false);
      }, 2000);
    }
  };

  return (
    <div className="mt-10 p-6 border border-accent/30 bg-accent/10 rounded-sm ">
      <div className="flex gap-2 items-center">
        <Icon icon="solar:danger-bold" className=" size-6 text-red-500" />
        <h2 className="text-lg font-semibold text-red-600">Change Password</h2>
      </div>

      <p className="text-sm text-red-600 mt-1">
        Change this user's password. Proceed with caution
      </p>

      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Change Password
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
          />

          <div className="flex gap-2">
            <button
              onClick={handlePasswordChange}
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition"
            >
              {loading && !success.length && (
                <div className=" border-2 border-white border-t-transparent rounded-full size-4 animate-spin" />
              )}
              {success.length > 0 && (
                <Icon icon="typcn:tick" className=" text-white size-6" />
              )}
              {!loading && "Confirm Changes"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setNewPassword("");
                setError("");
                setSuccess("");
              }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </div>
      )}
    </div>
  );
};

export default EditPassword;
