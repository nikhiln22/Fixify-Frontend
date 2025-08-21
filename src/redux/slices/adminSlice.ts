import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Iadmin } from "../../models/admin";

type AdminReduxData = Omit<Iadmin, "createdAt" | "updatedAt">;

interface AdminState {
  adminData: AdminReduxData | null;
}

const initialState: AdminState = {
  adminData: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminData: (state, action: PayloadAction<AdminReduxData>) => {
      state.adminData = action.payload;
    },
    clearAdminData: (state) => {
      state.adminData = null;
    },
  },
});

export const { setAdminData, clearAdminData } = adminSlice.actions;

export default adminSlice.reducer;
