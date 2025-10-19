"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: "admin" | "coach" | "user";
  image?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/auth/session", {
          withCredentials: true,
        });

        if (response.data.loggedIn) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          // No active session
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      
      setUser(null);
      localStorage.removeItem("user");
      
      // Redirect to login
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};