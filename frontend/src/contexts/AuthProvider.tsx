import { useState, ReactNode } from "react";
import AuthContext from "./authContext";
import { UserDetails } from "@type/user";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDetails | null>(null);

  const login = (newUser: UserDetails) => setUser(newUser);

  const updateUser = (updatedUser: Partial<UserDetails>) =>
    setUser((prev) => ({ ...prev!, ...updatedUser }));

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
