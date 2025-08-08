import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Iuser } from "../../models/user";

type UserReduxData = Omit<
  Iuser,
  | "status"
  | "role"
  | "createdAt"
  | "updatedAt"
  | "access_token"
  | "refresh_token"
>;

interface UserState {
  userData: UserReduxData | null;
}

const initialState: UserState = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserReduxData>) => {
      state.userData = action.payload;
    },
    updateUserData: (state, action: PayloadAction<Partial<UserReduxData>>) => {
      if (state.userData) {
        state.userData = {
          ...state.userData,
          ...action.payload,
        };
      }
    },
    clearUserData: (state) => {
      state.userData = null;
    },
  },
});

export const { setUserData, updateUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;
