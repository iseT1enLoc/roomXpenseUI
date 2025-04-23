import axios from 'axios';

const API_BASE = 'http://localhost:8080/api'; // Adjust if needed

export const createExpense = async (expenseData) => {
  return axios.post(`${API_BASE}/expense`, expenseData);
};
room_id = "3a8d661e-5589-4148-8627-728ba624fe2f"
export const getUserExpenses = async () => {
  return axios.get(`${API_BASE}/expense/user`);
};

export const calculateMonthlyExpense = async () => {
  return axios.get(`${API_BASE}/expense/calc`);
};
