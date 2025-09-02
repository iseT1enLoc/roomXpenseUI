// src/store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser, updateUser } from '../api/user';
import { getRooms } from '../api/roomService';

// --- Async Thunks ---

// Get the logged-in user profile
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async ({ instance, token }, { rejectWithValue }) => {
    try {
      const data = await getCurrentUser(instance, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ token, user, instance }, { rejectWithValue }) => {
    try {
      const data = await updateUser(token, user, instance);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch user's rooms
export const fetchRooms = createAsyncThunk(
  'user/fetchRooms',
  async ({ token } = {}, { rejectWithValue }) => {
    try {
      //if (!token) token = localStorage.getItem('oauthstate'); // fallback token
      const data = await getRooms(token);
      // Ensure data is always an array
      return Array.isArray(data) ? data : data.rooms || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- Slice ---
const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    error: null,
    success: false,
    rooms: [],
    roomsLoading: false,
    roomsError: null,
  },
  reducers: {
    clearUser: (state) => {
      state.profile = null;
      state.error = null;
      state.success = false;
      state.rooms = [];
      state.roomsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Current User ---
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // --- Update User ---
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // --- Fetch Rooms ---
      .addCase(fetchRooms.pending, (state) => {
        state.roomsLoading = true;
        state.roomsError = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.roomsLoading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.roomsLoading = false;
        state.roomsError = action.payload;
      });
  },
});

// --- Actions ---
export const { clearUser } = userSlice.actions;

// --- Selectors ---
export const selectUser = (state) => state.user.profile;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectUserSuccess = (state) => state.user.success;

export const selectRooms = (state) => state.user.rooms;
export const selectRoomsLoading = (state) => state.user.roomsLoading;
export const selectRoomsError = (state) => state.user.roomsError;

// --- Reducer ---
export default userSlice.reducer;
