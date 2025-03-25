"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Custom hook to get auth state
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Define public routes
  const publicRoutes = ["/sign-in"];

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/sign-in") {
        // Redirect unauthenticated users to the sign-in page
        router.push("/sign-in");
      }
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner while auth state is being determined
  }

  // Allow public routes to render without auth
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Render children for authenticated users
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
