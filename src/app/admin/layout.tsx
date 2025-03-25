"use client";

// app/admin/layout.tsx
import { Inter } from "next/font/google";

import ContextProvider from "@/components/context-provider";
import SideNav from "@/components/side-nav";
import Header from "@/app/header";
import ProtectedRoute from "@/components/ProtectedRoutes";

import "../../styles/globals.css"; // Adjusted path for global styles

const inter = Inter({ subsets: ["latin"] });


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProtectedRoute>
          <ContextProvider>
            {/* Header Section */}
            <Header />
            
            <div className="flex">
              {/* Sidebar Section */}
              <SideNav />

              {/* Main Content Section */}
              <div className="w-full overflow-x-auto">
                <div className="sm:h-[calc(99vh-60px)] overflow-auto">
                  <div className="w-full flex justify-center mx-auto h-[calc(100vh - 120px)] overflow-y-auto relative">
                    <div className="w-full md:max-w-6xl">{children}</div>
                  </div>
                </div>
              </div>
            </div>
          </ContextProvider>
        </ProtectedRoute>
      </body>
    </html>
  );
}
