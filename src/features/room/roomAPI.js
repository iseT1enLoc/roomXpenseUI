// src/api/roomAPI.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchRooms = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/protected/rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;  // assuming this returns the rooms data
  } catch (error) {
    throw new Error("Failed to fetch rooms");
  }
};
