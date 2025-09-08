import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL


export const addExpense = async ({ token, room_id, title, amount, notes, quantity,used_date }) => {
  if (!token) throw new Error('Không có token xác thực.');
  if (!title || amount < 0 || isNaN(amount) || quantity < 0) {
    throw new Error('Vui lòng điền đầy đủ và hợp lệ các trường.');
  }

  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/protected/expense`,
    {
      room_id,
      title,
      amount: parseFloat(amount),
      notes,
      quantity: parseInt(quantity) || 1,
      used_date:used_date
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const getUserExpenses = async (params,token) => {

  try {
      console.log(API_BASE+"/api/protected/expense/calc?room_id=5621d051-2916-4520-bc81-5b40279e9a23")
      const response = await axios.get(API_BASE+"/api/protected/expense/calc?room_id=5621d051-2916-4520-bc81-5b40279e9a23", {
        params,
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      return response.data
  } catch (error) {
    console.error('Error fetching Google OAuth URL:', error);
    throw error;
  }
};

export const getMemberExpenseDetails = async(token,params)=>{
  try{
    const response = await axios.get(`${API_BASE}/api/protected/expense/members?room_id=${params.room_id}`, {
      params,
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
export const getAMemberExpenseDetails = async (token, { user_id, room_id, year, month, day }) => {
  try {
    const params = { user_id, room_id, year };
    if (month) params.month = month;
    if (day) params.day = day;

    const res = await axios.get(baseUrl, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};