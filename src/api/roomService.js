import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL

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

export const createNewRoom = async (room_name, token) => {
  console.log("Enter create new room call api");
  try {
    const response = await axios.post(
      `${API_BASE}/api/protected/room/create`,
      { room_name }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating a new room", error);
    throw error.response?.data || error.message;
  }
};