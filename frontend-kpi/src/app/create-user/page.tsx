"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Swal from "sweetalert2";

interface Role {
  id: number;
  name: string;
}

type User = {
  username: string;
  email: string;
}

export default function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | "">("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const resRoles = await fetch("http://localhost:8000/auth/getroles", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await resRoles.json();
        if (!resRoles.ok) {
          console.log("Error fetch roles not found");
          return;
        }

        if (!Array.isArray(data)) {
          if (Array.isArray(data.roles)) {
            setRoles(data.roles);
            console.log("Roles Dropdown :", data.roles);
          } else {
            console.error("Unexpected roles format :", data.data);
          }
        } else {
          setRoles(data);
        }

        // const data = await res.json();
        // setRoles(data.data);
        console.log("roles :", data);
      } catch (error) {
        console.log("Error fetching roles :", error);
      }
    };
    fetchRoles();
  }, [username, email]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // check if username is empty
    if (!username || !password || !email || selectedRoleId === "") {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
      return;
    }
    
    const resUser = await fetch("http://localhost:8000/auth/getusers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!resUser.ok) {
      console.log("Error fetch roles not found");
      return;
    }

    const data = await resUser.json();
    const userData: User[] = await data.user;

    const userExist = userData.some(
      (User) => User.username === username || User.email === email
    );

    // Check username and email already exists
    if(userExist) {
      Swal.fire({
        icon: "error",
        title: "มีชื่อผู้ใช้หรืออีเมลนี้แล้ว",
      });
      return;
    }   

    // Check password and passwordConfirm
    if(password !== passwordConfirm) {
      Swal.fire({
        icon: "error",
        title: "ยืนยันรหัสผ่านไม่ถูกต้อง"
      });
      return;
    }

    const createUser = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
        roleId: selectedRoleId,
      }),
    });

    if (!createUser.ok) {
      const error = await createUser.json();
      console.error("create fielded :", error);
      Swal.fire({
        title: "error",
        text: "สร้าง Account ไม่สำเร็จ",
        icon: "error",
      });
      return;
    }
    const result = await createUser.json();
    Swal.fire({
      icon: "success",
      title: "สร้างผู้ใช้งานสำเร็จ",
      text: `ยินดีต้อนรับ ${username}`,
      confirmButtonText: "ตกลง",
    });

    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setSelectedRoleId("");
    console.log("created success :", result);
  };

  const buttonCancel = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setSelectedRoleId("");
  }
  return (
    // <div>page Create user</div>
    <>
      <Head>
        <title>KPI Register | KPI Management System</title>
        <meta
          name="description"
          content="ระบบลงทะเบียนตัวชี้วัดผลการปฏิบัติงาน"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-blue-800">
                    KPI Management System
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Admin</span>
                <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  ลงทะเบียน
                </h1>
                <p className="text-gray-600">กรอกข้อมูลผู้ใช้</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="kpiName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ชื่อผู้ใช้
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-20 transition duration-200"
                      placeholder="ระบุชื่อผู้ใช้"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="kpiDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-20 transition duration-200"
                      placeholder="ระบุอีเมล"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="kpiTarget"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-20 transition duration-200"
                      placeholder="ระบุรหัสผ่าน"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="kpiTarget"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ยืนยัน Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={passwordConfirm}
                      onChange={(event) =>
                        setPasswordConfirm(event.target.value)
                      }
                      className="w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-20 transition duration-200"
                      placeholder="ยืนยันรหัสผ่าน"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ตำแหน่ง
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={selectedRoleId}
                      onChange={(event) =>
                        setSelectedRoleId(Number(event.target.value))
                      }
                      className="w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-20 transition duration-200"
                    >
                      <option value="" disabled>
                        เลือกตำแหน่ง
                      </option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    {/* <Link href=""> */}
                    <a 
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={buttonCancel}
                      >
                      ยกเลิก
                    </a>
                    {/* </Link> */}
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      บันทึกข้อมูล
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
