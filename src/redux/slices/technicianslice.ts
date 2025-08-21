import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Itechnician } from "../../models/technician";

type TechnicianReduxData = Omit<Itechnician, "createdAt" | "updatedAt">;

interface TechnicianState {
  technicianData: TechnicianReduxData | null;
}

const initialState: TechnicianState = {
  technicianData: null,
};

const technicianSlice = createSlice({
  name: "technician",
  initialState,
  reducers: {
    setTechnicianData: (state, action: PayloadAction<TechnicianReduxData>) => {
      state.technicianData = action.payload;
    },
    updateTechnicianData: (
      state,
      action: PayloadAction<Partial<TechnicianReduxData>>
    ) => {
      if (state.technicianData) {
        state.technicianData = {
          ...state.technicianData,
          ...action.payload,
        };
      }
    },
    clearTechnicianData: (state) => {
      state.technicianData = null;
    },
  },
});

export const { setTechnicianData, updateTechnicianData, clearTechnicianData } =
  technicianSlice.actions;

export default technicianSlice.reducer;
