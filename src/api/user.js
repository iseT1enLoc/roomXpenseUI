import axios from "axios";
export const updateUser = async (token, user, instance) => {
    try {
      const res = await instance.put(`${import.meta.env.VITE_BACKEND_URL}/api/protected/user/${user.id}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Update Ok');
      return res.data;
    } catch (err) {
      if (err.response) {
        console.error('Server error: ', err.response.data.message, err.response.status);
        throw new Error(err.response.data.message || 'Error updating user');
      } else {
        console.error('Request error: ', err.message);
        throw new Error('Request error: ' + err.message);
      }
    }
};
  
export const getCurrentUser = async (instance, token) => {
    try {
      const res = await instance.get(`${import.meta.env.VITE_BACKEND_URL}/api/protected/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      if (err.response) {
        console.error('Server error: ', err.response.data.message, err.response.status);
        throw new Error(err.response.data.message || 'Error fetching current user');
      } else {
        console.error('Request error: ', err.message);
        throw new Error('Request error: ' + err.message);
      }
    }
};



export const fetchCurrentUser = async (token) => {
  if (!token) throw new Error('No token provided');

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/protected/user/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // return user data
  } catch (err) {
    if (err.response?.status === 401) {
      // Invalid token
      localStorage.removeItem('oauthstate');
      throw new Error('Unauthorized');
    } else {
      throw new Error(err);
    }
  }
};

    