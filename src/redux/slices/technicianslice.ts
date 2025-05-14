import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Itechnician } from "../../models/technician";

type TechnicianReduxData = Omit<
  Itechnician,
  | "status"
  | "role"
  | "createdAt"
  | "updatedAt"
  | "access_token"
  | "refresh_token"
>;

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
      action: PayloadAction<Partial<TechnicianReduxData>>,
    ) => {
      if (state.technicianData) {
        state.technicianData = {
          ...state.technicianData,
          ...action.payload,
        };
      }
    },
  },
});

export const { setTechnicianData, updateTechnicianData } =
  technicianSlice.actions;

export default technicianSlice.reducer;
