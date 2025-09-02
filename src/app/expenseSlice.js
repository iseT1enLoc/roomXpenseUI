// src/store/expenseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createExpense, getUserExpenses, calculateMonthlyExpense } from '../api/expense';
import axios from 'axios';

// === Async Thunks ===
export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await createExpense(expenseData);
      return response.data; // The new expense
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add expense');
    }
  }
);

export const fetchUserExpenses = createAsyncThunk(
  'expenses/fetchUserExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserExpenses();
      return response.data; // Array of expenses
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch expenses');
    }
  }
);

export const fetchMonthlyExpense = createAsyncThunk(
  'expenses/fetchMonthlyExpense',
  async (_, { rejectWithValue }) => {
    try {
      const response = await calculateMonthlyExpense();
      return response.data; // Monthly summary
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to calculate monthly expenses');
    }
  }
);

// === Fetch Room Expenditure ===
export const fetchRoomExpenditure = createAsyncThunk(
  'expenses/fetchRoomExpenditure',
  async ({ room_id, year, month, day, token }, { rejectWithValue }) => {
    try {
      const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/protected/expense/calc`;
      const params = { room_id, year };
      if (month) params.month = month;
      if (day) params.day = day;

      const response = await axios.get(baseUrl, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 'success') {
        return response.data.data;
      } else {
        return rejectWithValue('Không thể lấy dữ liệu chi tiêu phòng.');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải dữ liệu chi tiêu.');
    }
  }
);

// === Slice ===
const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [],                  // list of user expenses
    monthly: null,              // monthly summary
    roomExpenditure: null,      // room expenditure details
    loading: false,
    error: null,
    roomExpenditureLoading: false,
    roomExpenditureError: null,
  },
  reducers: {
    clearExpenses: (state) => {
      state.items = [];
      state.monthly = null;
      state.error = null;
    },
    clearRoomExpenditure: (state) => {
      state.roomExpenditure = null;
      state.roomExpenditureError = null;
    },
    clearRoomExpenditureError: (state) => {
      state.roomExpenditureError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Add Expense ---
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Fetch User Expenses ---
      .addCase(fetchUserExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Fetch Monthly Expense ---
      .addCase(fetchMonthlyExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.monthly = action.payload;
      })
      .addCase(fetchMonthlyExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Fetch Room Expenditure ---
      .addCase(fetchRoomExpenditure.pending, (state) => {
        state.roomExpenditureLoading = true;
        state.roomExpenditureError = null;
      })
      .addCase(fetchRoomExpenditure.fulfilled, (state, action) => {
        state.roomExpenditureLoading = false;
        state.roomExpenditure = action.payload || { member_stat: [], room_total_expense: 0 };
      })
      .addCase(fetchRoomExpenditure.rejected, (state, action) => {
        state.roomExpenditureLoading = false;
        state.roomExpenditureError = action.payload;
      });
  },
});

// === Actions ===
export const { clearExpenses, clearRoomExpenditure, clearRoomExpenditureError } = expenseSlice.actions;

// === Selectors ===
export const selectExpenseItems = (state) => state.expenses.items;
export const selectExpenseLoading = (state) => state.expenses.loading;
export const selectExpenseError = (state) => state.expenses.error;
export const selectMonthlyExpense = (state) => state.expenses.monthly;
export const selectRoomExpenditure = (state) => state.expenses.roomExpenditure;
export const selectRoomExpenditureLoading = (state) => state.expenses.roomExpenditureLoading;
export const selectRoomExpenditureError = (state) => state.expenses.roomExpenditureError;

// === Reducer ===
export default expenseSlice.reducer;
