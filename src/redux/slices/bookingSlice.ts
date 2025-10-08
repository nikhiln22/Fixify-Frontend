import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IService } from "../../models/service";
import { IAddress } from "../../models/address";
import { Itechnician } from "../../models/technician";
import { ITimeSlot } from "../../models/timeslot";

interface BookingState {
  service: IService | null;
  address: IAddress | null;
  technician: Itechnician | null;
  selectedSlot: ITimeSlot | null;
}

const initialState: BookingState = {
  service: null,
  address: null,
  technician: null,
  selectedSlot: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingData: (state, action: PayloadAction<Partial<BookingState>>) => {
      if (
        action.payload.technician &&
        action.payload.technician !== state.technician
      ) {
        state.selectedSlot = null;
      }

      state.service = action.payload.service ?? state.service;
      state.address = action.payload.address ?? state.address;
      state.technician = action.payload.technician ?? state.technician;

      if (action.payload.selectedSlot !== undefined) {
        state.selectedSlot = action.payload.selectedSlot;
      }
    },

    clearBookingData: () => initialState,
  },
});

export const { setBookingData, clearBookingData } = bookingSlice.actions;
export default bookingSlice.reducer;
