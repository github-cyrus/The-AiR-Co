"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

export default function GoogleLogin() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to main platform
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle redirect
    } catch (error) {
      alert("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <img src="/placeholder-logo.svg" alt="Logo" className="w-20 h-20 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome to The Air Co Platform</h1>
        <p className="mb-6 text-gray-600 text-center">Sign in to continue</p>
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.13 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.13 13.13 17.57 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.01l7.19 5.6C43.98 37.36 46.1 31.45 46.1 24.55z"/>
              <path fill="#FBBC05" d="M10.67 28.29c-1.13-3.36-1.13-6.93 0-10.29l-7.98-6.2C.7 16.18 0 19.01 0 22c0 2.99.7 5.82 1.97 8.2l8.7-6.91z"/>
              <path fill="#EA4335" d="M24 44c6.13 0 11.64-2.03 15.53-5.54l-7.19-5.6c-2.01 1.35-4.6 2.14-8.34 2.14-6.43 0-11.87-3.63-14.33-8.79l-8.7 6.91C6.73 42.18 14.82 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </g>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
} 