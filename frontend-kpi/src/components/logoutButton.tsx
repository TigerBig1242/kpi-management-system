'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
export default function LogoutButton() {
    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        router.push('login');
    }
  return (
    <button
      onClick={handleLogout}
      className={` flex items-center}`}
    >
      <span>ออกจากระบบ</span>
    </button>
  )
}
