import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true,
  },
  reducers: {
    setuserdata: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    updateCredits: (state, action) => {
      if (state.userData?.user) {
        state.userData.user.credits = action.payload;
      }
    },
  },
});

export const { setuserdata, updateCredits } = userSlice.actions;

export default userSlice.reducer;