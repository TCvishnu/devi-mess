import { createContext } from "react";
import { UserDetails } from "@type/user";

export type AuthContextType = {
  user: UserDetails | null;
  login: (user: UserDetails) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<UserDetails>) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export default AuthContext;
