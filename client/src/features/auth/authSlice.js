import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  token: null,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setToken, logout } = authSlice.actions;

export default authSlice.reducer;
