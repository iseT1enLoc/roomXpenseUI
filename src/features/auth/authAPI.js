import axios from 'axios';

// Base URL of the backend
const API_URL = import.meta.env.VITE_BACKEND_URL;

// Function to initiate Google OAuth login
export const googleLogin = async () => {
  try {
    // Redirect to the Google OAuth URL for authentication
    const googleOAuthUrl = `${API_URL}/api/public/google/login`;
    window.location.href = googleOAuthUrl;
  } catch (error) {
    throw new Error('Google login failed');
  }
};

// Function to handle token authentication and save to localStorage
export const authenticateToken = (token) => {
  try {
    // Store token in localStorage
    localStorage.setItem('oauthstate', token);
  } catch (error) {
    throw new Error('Failed to store token');
  }
};

// Function to fetch the user data after authentication
export const fetchUserData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/protected/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Return user data
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};

// Function to handle logout by removing token from localStorage
export const logout = () => {
  try {
    localStorage.removeItem('oauthstate');
  } catch (error) {
    throw new Error('Logout failed');
  }
};
