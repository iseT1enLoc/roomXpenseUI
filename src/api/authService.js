// src/services/googleAuth.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL

// Function to get the OAuth URL from the Go backend
export const getGoogleOAuthUrl = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/public/google/login`);
    return response.data.url; // The URL from the backend
  } catch (error) {
    console.error('Error fetching Google OAuth URL:', error);
    throw error;
  }
};

// Function to store the token in localStorage
export const storeAuthToken = (token) => {
  localStorage.setItem('oauthstate', token); // Store token in localStorage
};

// Function to retrieve the token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('oauthstate');
};
