// src/slices/roomSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRooms } from "../room/roomAPI";

// Async thunk to fetch rooms
export const getRooms = createAsyncThunk(
  "rooms/getRooms",
  async (token, { rejectWithValue }) => {
    try {
      const rooms = await fetchRooms(token);
      return rooms;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const roomSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRooms.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        state.rooms = action.payload;
        state.loading = false;
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default roomSlice.reducer;

