"use client";

import { useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Get the ID token and check for the admin claim
      const tokenResult = await user.getIdTokenResult();
      if (tokenResult.claims.admin) {
        router.push("/admin"); // Redirect to admin dashboard
      } else {
        setError("You do not have admin privileges.");
        await signOut(auth); // Sign out the user if they don't have admin privileges
        router.push("https://windowshop.ai"); // Redirect non-admin users to windowshop.ai
      }
    } catch (err: any) {
      setError("Google Sign-In failed: " + err.message);
    }
  };

  // Handle Login with Password (disabled functionality)
  const handleLoginWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("Email/Password login is disabled. Please use Google Sign-In.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[120vh] bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="bg-red-500 text-white p-2 rounded w-full"
        >
          Sign in with Google
        </button>
        <form onSubmit={handleLoginWithPassword} className="mt-4">
          <button
            type="submit"
            className="bg-gray-500 text-white p-2 rounded w-full"
          >
            Login with Email (Disabled)
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
