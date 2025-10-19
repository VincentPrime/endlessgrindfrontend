"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/AuthContext";
import axios from "axios";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "coach" | "user")[];
}

export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user, setUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify session with backend
        const response = await axios.get("http://localhost:4000/api/auth/session", {
          withCredentials: true,
        });

        if (response.data.loggedIn) {
          const userData = response.data.user;
          
          // Update context if user is not set
          if (!user) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }

          // Check if user has permission for this route
          if (allowedRoles && !allowedRoles.includes(userData.role)) {
            // Redirect to appropriate dashboard based on role
            if (userData.role === "admin") {
              router.push("/Admin/dashboard");
            } else if (userData.role === "coach") {
              router.push("/Coach/dashboard");
            } else {
              router.push("/Users/dashboard");
            }
            return;
          }

          setIsChecking(false);
        } else {
          // No active session, redirect to login
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear local storage and redirect to login
        localStorage.removeItem("user");
        setUser(null);
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [pathname, allowedRoles, user, setUser, router]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}