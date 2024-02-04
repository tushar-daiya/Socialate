import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import { allApi } from "./api/allApi";
export const store = configureStore({
  reducer: {
    [allApi.reducerPath]: allApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([allApi.middleware]),
});
