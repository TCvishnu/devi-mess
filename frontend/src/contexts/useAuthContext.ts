import { useContext } from "react";
import { AuthContext, AuthContextType } from "./AuthProvider";

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

export default useAuthContext;
