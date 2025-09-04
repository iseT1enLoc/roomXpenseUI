import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store"; 
import { selectIsAuthenticated } from "../../app/authSlice";
const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleGoogleLogin = async () => {
    try {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/public/google/login`;
    } catch (err) {
      console.error("❌ Google login redirect failed:", err);
    }
  };

  useEffect(() => {
    if(isAuthenticated){
      navigate("/rooms", { replace: true })
    }
  }, []);
  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="text-center max-w-md px-6 space-y-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              CHÀO AE 703 NHÁ 🚀
            </h1>
            <p className="text-md sm:text-lg text-gray-600">
              Track shared room expenses, split bills, and stay transparent with your roommates.
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