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

export const getUserExpenses = async () => {
  return axios.get(`${API_BASE}/expense/user`, getAuthHeaders());
};

export const calculateMonthlyExpense = async () => {
  return axios.get(`${API_BASE}/expense/calc`, getAuthHeaders());
};
