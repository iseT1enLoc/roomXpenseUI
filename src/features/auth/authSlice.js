import { createSlice } from '@reduxjs/toolkit';

const tokenFromStorage = localStorage.getItem("oauthstate");

const initialState = {
  user: null, // No user stored in localStorage
  token: tokenFromStorage || null,
  isAuthenticated: !!tokenFromStorage,
};
// console.log("Saving to localStorage:", action.payload.token);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.isAuthenticated = true;
      localStorage.setItem('oauthstate', action.payload.token);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('oauthstate');
    },
    checkAuth: (state) => {
      const token = localStorage.getItem('oauthstate');
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      } else {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      }
    },
  },
});

export const { loginSuccess, logout, setUser, checkAuth } = authSlice.actions;
// Selector to select auth state (you can add more selectors for other state pieces)
export const authSelector = (state) => state.auth;
export default authSlice.reducer;
