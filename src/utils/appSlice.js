import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isMenuOpen: true,
    selectedCategoryId: null,
  },
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    closeMenu: (state) => {
      state.isMenuOpen = false;
    },
    setCategory: (state, action) => {
      state.selectedCategoryId = action.payload;
    },
  },
});

export const { toggleMenu, closeMenu, setCategory } = appSlice.actions;
export default appSlice.reducer;
