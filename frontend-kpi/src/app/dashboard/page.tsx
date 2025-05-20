"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
        ChartNoAxesColumn, ChartLine, BookText, ClipboardPlus, UserPen, Cog, ArrowBigRight, ArrowBigLeft, UserPlus, LogOut
    } from 'lucide-react';
import LogoutButton from "@/components/logoutButton";
// import navbar from "@/components/navbar";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if(!token) {
        router.push("/login");
      }
      console.log("token :", token);
      if (!token) {
        setError("Token not found");
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/auth/user-or-admin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          setError(err.message);
          return;
        }

        const data = await res.json();
        setUser(data);
        console.log("data user :", data);
      } catch (error) {
        console.log("Error fetching :", error);
      }
    };
    fetchUser();
  }, [router]);
  // router.push('/create-user');

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    // <navbar/>


    <div className="flex h-screen bg-gray-300">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <div className="flex items-center">
            {isSidebarOpen && <div className="text-xl font-bold text-blue-400">KPI System</div>}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-800"
          >
            {isSidebarOpen ? <ArrowBigLeft className="mr-3 w-5 h-5" /> : <ArrowBigRight className="mr-3 w-5 h-5" />}
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div
            className={`flex items-center px-4 py-3 mb-2 rounded-lg bg-blue-600`}
          >
            <ChartNoAxesColumn className="mr-3 w-5 h-5" />
            {isSidebarOpen && <span>แดชบอร์ด</span>}
          </div>

          <div
            className={`flex items-center px-4 py-3 mb-2 rounded-lg hover:bg-gray-800 cursor-pointer`}
          >
            <ChartLine className="mr-3 w-5 h-5" />
            {isSidebarOpen && <span>จัดการ KPI</span>}
          </div>

          <div
            className={`flex items-center px-4 py-3 mb-2 rounded-lg hover:bg-gray-800 cursor-pointer`}
          >
            <BookText className="mr-3 w-5 h-5" />
            {isSidebarOpen && <span>การประเมิน</span>}
          </div>

          <div
            className={`flex items-center px-4 py-3 mb-2 rounded-lg hover:bg-gray-800 cursor-pointer`}
          >
            <ClipboardPlus className="mr-3 w-5 h-5" />
            {isSidebarOpen && <span>รายงาน</span>}
          </div>

          <div className="border-t border-gray-800 my-4"></div>
            <div
                className={`flex items-center px-4 py-3 mb-2 rounded-lg hover:bg-gray-800 cursor-pointer`}
            >
            <UserPen className="mr-3 w-5 h-5" />
            {isSidebarOpen && <span>
                จัดการผู้ใช้
                
            </span>}
          </div>
          {user.role === "admin" && (
          <div
            className={`flex items-center px-4 py-3 mb-2 rounded-lg hover:bg-gray-800 cursor-pointer`}
            onClick={() => router.push("/create-user")}
          >
            <UserPlus className="mr-3 w-5 h-5" />
            {isSidebarOpen && <span className="me-3">สร้าง Account</span>}
          </div>
            )}

          <div
            className={`flex items-center px-4 py-3 mb-2 rounded-lg hover:bg-gray-800 cursor-pointer`}
          >
            <Cog className="mr-3 w-5 h-5" />
            {isSidebarOpen && <span>ตั้งค่า</span>}
          </div>
          
          <div
            className={`flex items-center px-4 py-3 mb-2 rounded-lg hover:bg-gray-800 cursor-pointer`}
          >
              <LogOut className="mr-3 w-5 h-5" />
              {isSidebarOpen && <span> <LogoutButton /> </span>}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span>A</span>
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="font-medium">{user.username}</p>
                <p className="text-xs text-gray-400">ผู้ดูแลระบบ</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <header className=" bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">แดชบอร์ด</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="relative cursor-pointer">
                🔔
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
                  3
                </span>
              </div>
            </div>
          </div>
        </header>
    </div>
      </div>

    // -----------------------------------------------------------------------------------------------
  );
}
