import { createContext, useState, ReactNode } from "react";
import { UserDetails } from "@type/user";

export type AuthContextType = {
  user: UserDetails | null;
  login: (user: UserDetails) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<UserDetails>) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

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
