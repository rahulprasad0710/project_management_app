import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface initialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  isDataRefetchList: boolean;
}

const initialState: initialStateTypes = {
  isSidebarCollapsed: true,
  isDarkMode: false,
  isDataRefetchList: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setRefetchProjectTaskList: (state, action: PayloadAction<boolean>) => {
      state.isDataRefetchList = action.payload;
    },
  },
});

export const {
  setIsSidebarCollapsed,
  setIsDarkMode,
  setRefetchProjectTaskList,
} = globalSlice.actions;
export default globalSlice.reducer;
