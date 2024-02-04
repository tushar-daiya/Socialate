import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  isLogged: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLogged = true;
    },
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectIsLogged = (state) => state.user.isLogged;
export default userSlice.reducer;
