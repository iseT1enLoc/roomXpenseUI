import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL
export const getAllPendingInvitations = async(token)=>{
  try{
    const response = await axios.get(`${API_BASE}/api/protected/room/invitations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;    
  }catch(error){
    console.error('Fail to get user data', error);
    throw error;    
  }
}
export const updateInvitationStatus = async(recipient_id,status,token)=>{
  try{
    const response = await axios.put(`${API_BASE}/api/protected/room/update/invitations`,
      {recipient_id,status},
      {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      }

    );
    return response.data;    
  }catch(error){
    console.error('Fail to get user data', error);
    throw error;    
  }
}
export const sendRoomInvitation = async ({ room_id, emails, message, token }) => {
  try {
    const response = await axios.post(
      `${API_BASE}/api/protected/room/send_invitation`,
      {
        room_id,
        emails,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send room invitation:", error);
    throw error;
  }
};