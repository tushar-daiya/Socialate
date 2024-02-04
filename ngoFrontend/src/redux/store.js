import { configureStore } from "@reduxjs/toolkit";
import ngoReducer from "./features/ngo/ngoSlice.js";
import { authApi } from "./api/authApi.js";
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    ngo: ngoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});


