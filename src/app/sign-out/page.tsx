// app/logout/page.tsx

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebaseClient';
import { signOut } from 'firebase/auth';

export default function LogoutPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to the home or login page after logout
    } catch (err: any) {
      setError('Logout failed: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Logout</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <button
          type="button"
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded w-full"
        >
          Logout
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
