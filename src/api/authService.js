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
