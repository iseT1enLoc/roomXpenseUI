import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getGoogleOAuthUrl } from '../api/authService';

// Async thunk to fetch Google OAuth URL
export const fetchGoogleOAuthUrl = createAsyncThunk(
  'auth/fetchGoogleOAuthUrl',
  async (_, { rejectWithValue }) => {
    try {
      const url = await getGoogleOAuthUrl();
      return url;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get Google OAuth URL');
    }
  }
);


const initialState = {
  token: localStorage.getItem('oauthstate'),
  isAuthenticated: !!localStorage.getItem('oauthstate'),
  loading: false,
  error: null,
  googleOAuthUrl: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      console.log("ENTER LOGIN SUCCESS")
      localStorage.setItem('oauthstate', action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('oauthstate');
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('oauthstate'); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoogleOAuthUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoogleOAuthUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.googleOAuthUrl = action.payload;
      })
      .addCase(fetchGoogleOAuthUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { loginSuccess, logout, clearToken } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
export const selectGoogleOAuthUrl = (state) => state.auth.googleOAuthUrl;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;


export default authSlice.reducer;