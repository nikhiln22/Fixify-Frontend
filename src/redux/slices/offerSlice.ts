import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OfferData } from "../../types/user.types";

interface offerState {
  currentOffer: OfferData | null;
}

const initialState: offerState = {
  currentOffer: null,
};

export const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    setOfferData(state, action: PayloadAction<OfferData>) {
      state.currentOffer = action.payload;
    },
    clearOfferData(state) {
      state.currentOffer = null;
    },
  },
});

export const { setOfferData, clearOfferData } = offerSlice.actions;
export default offerSlice.reducer;
