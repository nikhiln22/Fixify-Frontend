import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CouponData } from "../../types/user.types";

interface CouponState {
  appliedCoupon: CouponData | null;
}

const initialState: CouponState = {
  appliedCoupon: null,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    applyCoupon: (state, action: PayloadAction<CouponData>) => {
      state.appliedCoupon = action.payload;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },
    clearCouponData: (state) => {
      state.appliedCoupon = null;
    },
  },
});

export const { applyCoupon, removeCoupon, clearCouponData } =
  couponSlice.actions;

export default couponSlice.reducer;
