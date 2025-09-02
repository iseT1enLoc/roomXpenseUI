import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL
const getAuthHeaders = () => {
  const token = localStorage.getItem('oauthstate');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getRooms = async (token) => {
  try {
    const response = await axios.get(`${API_BASE}/api/protected/rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response from /rooms:", response.data); 
    // return rooms array (adjust depending on backend response)
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error.response?.data || error.message;
  }
};