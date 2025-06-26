import { useContext } from "react";
import AuthContext from "./authContext";
import { type AuthContextType } from "./authContext";

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

export default useAuthContext;
