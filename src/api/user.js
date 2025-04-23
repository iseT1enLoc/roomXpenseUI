export const updateUser = async (token, user, instance) => {
    try {
      const res = await instance.put(`http://localhost:8080/api/protected/user/${user.id}`, user, {
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
      const res = await instance.get('http://localhost:8080/api/protected/user/me', {
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
  