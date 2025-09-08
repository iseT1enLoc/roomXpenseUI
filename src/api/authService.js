// src/services/googleAuth.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL

export const getGoogleOAuthUrl = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/public/google/login`);
    return response.data.url; // The URL from the backend
  } catch (error) {
    console.error('Error fetching Google OAuth URL:', error);
    throw error;
  }
};

export const storeAuthToken = (token) => {
  localStorage.setItem('oauthstate', token); 
};


export const getAuthToken = () => {
  return localStorage.getItem('oauthstate');
};
export const refreshToken = async (oldToken) => {
  try {
    const res = await axios.post(`${API_URL}/api/public/access_token`, {
      token: oldToken,
    });

    console.log("Refresh response:", res.data);

    // Adjust based on your backend response shape
    return res.data?.data?.token || null;
  } catch (error) {
    console.error("Axios error while refreshing token:", error);
    throw error;
  }
};