import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMemberExpenseDetails, getUserExpenses } from '../api/expense';
import { param } from 'framer-motion/client';

export const fetchUserExpenses = createAsyncThunk(
  'expenses/fetchUserExpenses',
  async ({ params, token }, { rejectWithValue }) => {
    try {
      const response = await getUserExpenses(params, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch expenses');
    }
  }
);
export const fetchUserDetailExpenses = createAsyncThunk(
  'expenses/fetchUserDetailExpense',
  async ({ params, token }, { rejectWithValue }) => {
    try {
      const response = await getUserExpenses(params, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch expenses');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expense',
  initialState: {
    memstats: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearExpenses: (state) => {
      state.memstats = [];
      state.loading = false;
      state.error = null;
    },
    fetchRoomExpense: (state, action) => {
      state.memstats = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchMemberExpenses: (state,action)=>{
      state.memstats = action.payload;
      state.loading=false;
      state.error=true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.memstats = action.payload;
      })
      .addCase(fetchUserExpenses.rejected, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.error = action.payload;
      })
  },
});
export const selectMemStats = (state) => state.expense.memstats;
export const { clearExpenses, fetchRoomExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
