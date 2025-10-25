"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// ✅ Updated RegularUser interface with all fields
interface RegularUser {
  user_id: number;
  firstname: string;
  middlename?: string | null;
  lastname: string;
  sex?: string;
  civil_status?: string;
  date_of_birth?: string;
  weight?: number | null;
  height?: number | null;
  address?: string | null;
  email: string;
  role: "admin" | "user";
  image?: string;
}

// ✅ UPDATED CoachUser interface with ALL fields
interface CoachUser {
  user_id: number;
  coach_name: string;
  email: string;
  role: "coach";
  profile_image?: string;
  specialty?: string;  // ✅ Added
  years_of_experience?: number;  // ✅ Added
  availability?: string;  // ✅ Added
}

// ✅ Union type for User
type User = RegularUser | CoachUser;

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
        const response = await axios.get("/api/auth/session", {
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
        "/api/auth/logout",
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

// ✅ Export type guard helpers
export const isCoach = (user: User | null): user is CoachUser => {
  return user !== null && user.role === "coach";
};

export const isRegularUser = (user: User | null): user is RegularUser => {
  return user !== null && (user.role === "admin" || user.role === "user");
};