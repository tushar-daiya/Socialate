import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  ngo: null,
  isLogged: false,
};

export const ngoSlice = createSlice({
  name: "ngo",
  initialState,
  reducers: {
    setNgo: (state, action) => {
      state.ngo = action.payload;
      state.isLogged = true;
    },
  },
});

export const { setNgo } = ngoSlice.actions;
export const selectNgo = (state) => state.ngo.ngo;
export const selectIsLogged = (state) => state.ngo.isLogged;
export default ngoSlice.reducer;
