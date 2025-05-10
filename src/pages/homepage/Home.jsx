// src/pages/HomePage.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout, setUser, checkAuth } from "../../features/auth/authSlice.js";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { googleLogin, authenticateToken, fetchUserData } from "../../features/auth/authAPI.js"; 
import { authSelector } from "../../features/auth/authSlice.js"; // Import the authSelector

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useSelector(authSelector);

  // Trigger checkAuth to verify if the user is already authenticated on app load
  useEffect(() => {
    dispatch(checkAuth()); // Check if there's a valid token in localStorage
  }, [dispatch]);

  // Google login button
  const handleGoogleLogin = () => {
    googleLogin();
  };

  // Get token from URL, save to redux + localStorage, then fetch user
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const storedToken = localStorage.getItem('oauthstate');

    const fetchUser = async (authToken) => {
      try {
        const userData = await fetchUserData(authToken);
        dispatch(setUser(userData));
        navigate("/rooms");
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
      }
    };

    if (tokenFromUrl) {
      dispatch(loginSuccess({ token: tokenFromUrl }));
      authenticateToken(tokenFromUrl);
      fetchUser(tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (storedToken && !token) {
      fetchUser(storedToken);
    }
  }, [dispatch, navigate, token]);

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="text-center max-w-md px-6 space-y-8">
        {isAuthenticated && user ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
            <p className="text-md text-gray-600">You're successfully logged in 🎉</p>
            <button
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
