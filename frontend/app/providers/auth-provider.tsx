import { createContext, useState } from "react";
import type {  User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const signIn = async (data: any) => {
    
  }
  const signOut = async () => {
    
  }
  return <AuthContext.Provider value={{ user, isAuthenticated, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>;
};


export { AuthContext, AuthProvider };
