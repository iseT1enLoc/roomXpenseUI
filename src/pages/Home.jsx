import React from "react";
import { FcGoogle } from "react-icons/fc";

const HomePage = () => {
  const handleGoogleLogin = async () => {
    try {
      // Step 1: Get the Google OAuth URL from the Go backend
      const googleOAuthUrl = `${import.meta.env.VITE_BACKEND_URL}/api/public/google/login`;
      console.log(googleOAuthUrl)
      
      // Step 2: Redirect the user to Google's OAuth consent screen
      if (googleOAuthUrl) {
        console.log(googleOAuthUrl)
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/public/google/login`; // Use the URL returned from the backend
      } else {
        console.error("Google OAuth URL is not available.");
        console.log("URL:", window.location.href);
        console.log("Search Params:", window.location.search);
        console.log("Token:", new URLSearchParams(window.location.search).get("token"));

      }
    } catch (error) {
      console.error("Error during Google login:", error);
      console.log("URL:", window.location.href);
      console.log("Search Params:", window.location.search);
      console.log("Token:", new URLSearchParams(window.location.search).get("token"));
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="text-center max-w-md px-6 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          CHÀO AE 703 NHÁ, BẢNG TEST CHO CÓ ĐỘNG LỰC LÀM TIẾP
        </h1>

        <p className="text-md sm:text-lg text-gray-600">
          Track shared room expenses, split bills, and stay financially transparent with your roommates.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="mx-auto px-6 py-3 flex items-center justify-center gap-3 bg-white text-gray-800 border border-gray-300 rounded-full shadow-md hover:shadow-lg hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default HomePage;
