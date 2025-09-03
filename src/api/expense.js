import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createExpense = async (expenseData) => {
  return axios.post(`${API_BASE}/api/protected/expense`, expenseData, getAuthHeaders());
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
