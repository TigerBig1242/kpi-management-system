'use client'
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Login with :", email, password);

    try {
           // Check email and password not empty
      if(!email || !password) {
        console.log("Email and Password is empty");
        return;
      }

      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if(!response.ok) {
        const error = await response.json();
        console.log("Login fielded", error);
        return;
      }

      const result = await response.json();
      
      // Check email or password wrong
      if(email !== result.email || password !== result.password) {
        console.log("Email or Password is correct");
      }
      localStorage.setItem('accessToken', result.accessToken);
      router.push('/dashboard');

      console.log("Login success", result);
    } catch (error) {
      console.error("Login error :", error);
    }
    
  };

  return (
      <div className="max-w-screen bg-gray-100">
        <form 
          onSubmit={handleSubmit}
          className="h-full"
        >
          {/* Left side - Brand/Info */}
          <div className="hidden md:flex bg-blue-600 flex-col justify-center items-center text-white p-10">
            <div className="max-w-md">
              <h1 className="text-4xl font-bold mb-6">ระบบจัดการ KPI</h1>
              <p className="text-xl mb-8">
                ยกระดับการจัดการประสิทธิภาพองค์กรของคุณด้วยระบบที่ทันสมัยและใช้งานง่าย
              </p>
              <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="bg-blue-500 p-4 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-bold mb-1">ติดตาม KPI แบบเรียลไทม์</h3>
                  <p className="text-sm text-blue-100">
                    ติดตามความคืบหน้าได้ทุกที่ทุกเวลา
                  </p>
                </div>
                <div className="bg-blue-500 p-4 rounded-lg">
                  <div className="text-3xl mb-2">🔍</div>
                  <h3 className="font-bold mb-1">รายงานที่ครอบคลุม</h3>
                  <p className="text-sm text-blue-100">
                    ข้อมูลเชิงลึกที่ช่วยในการตัดสินใจ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full flex justify-center items-center p-6">

            <div className="w-full max-w-md">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">
                  เข้าสู่ระบบ
                </h2>
                <p className="text-gray-600 mt-2">
                  กรอกข้อมูลด้านล่างเพื่อเข้าสู่ระบบ
                </p>
              </div>

              <div className="space-y-6">
                {/* <form 
                  onSubmit={handleSubmit}
                  className="h-full"
                > */}
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    อีเมล
                  </label>
                  <input
                    className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    // id="email"
                    type="email"
                    placeholder="กรอกอีเมลของคุณ"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      className="block text-gray-700 text-sm font-bold"
                      htmlFor="password"
                    >
                      รหัสผ่าน
                    </label>
                    <a className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      ลืมรหัสผ่าน?
                    </a>
                  </div>
                  <input
                    className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    // id="password"
                    type="password"
                    placeholder="กรอกรหัสผ่านของคุณ"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    จดจำฉัน
                  </label>
                </div>

                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
                  type="submit"
                  // onClick={() => router.push('dashboard')}
                >
                  เข้าสู่ระบบ
                </button>
              {/* </form> */}
              </div>

              <div 
                className="text-center mt-8"
                onClick={() => router.push('/create-user')}
              >
                <p className="text-gray-600">
                  ยังไม่มีบัญชี?{" "}
                  <a className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                    ลงทะเบียน
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
}
