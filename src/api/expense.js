import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL

const getAuthHeaders = () => {
  const token = localStorage.getItem('oathstate');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const addExpense = async ({ token, room_id, title, amount, notes, quantity }) => {
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

export const calculateMonthlyExpense = async () => {
  return axios.get(`${API_BASE}/expense/calc`, getAuthHeaders());
};
