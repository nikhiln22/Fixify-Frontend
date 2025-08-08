import { combineReducers, configureStore } from "@reduxjs/toolkit";
import technicianReducer from "../redux/slices/technicianslice";
import userReducer from "../redux/slices/userSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import couponReducer from "../redux/slices/couponSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  technician: technicianReducer,
  user: userReducer,
  coupon: couponReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
