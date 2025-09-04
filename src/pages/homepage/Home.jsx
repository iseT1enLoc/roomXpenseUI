import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store"; 
import { loginSuccess, logout } from "../../app/authSlice"; 
import { getCurrentUser } from "../../api/user"; 
import axios from "axios";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, token } = useAppSelector((state) => state.auth);

  // Google login button → redirect to backend OAuth URL
  const handleGoogleLogin = async () => {
    try {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/public/google/login`;
    } catch (err) {
      console.error("❌ Google login redirect failed:", err);
    }
  };

  // Handle token from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const storedToken = localStorage.getItem("oauthstate");
    
    const fetchUser = async (authToken) => {
      try {
        // use axios instance (can add interceptors later)
        const instance = axios.create();
        const userData = await getCurrentUser(instance, authToken);
        console.log("✅ User fetched:", userData);

        // Save user to Redux
        dispatch(loginSuccess(authToken));
        localStorage.setItem("oauthstate", authToken);

        navigate("/rooms");
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
      }
    };
    if(tokenFromUrl||storedToken){
      navigate("/rooms", { replace: true })
      //setTimeout(() => navigate("/rooms", { replace: true }), 500);
    }
    if (tokenFromUrl) {
      fetchUser(tokenFromUrl);

      // clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (storedToken && !token) {
      fetchUser(storedToken);
    }
  }, [dispatch, navigate, token]);

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