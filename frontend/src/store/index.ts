import type { ITask } from "../types/config.types";
import { createSlice } from "@reduxjs/toolkit";

export interface initialStateTypes {
    isSidebarCollapsed: boolean;
    isDarkMode: boolean;
    isDataRefetchList: boolean;
    isTaskDetailsModalOpen: boolean;
    taskDetailsData: ITask | undefined;
}

const initialState: initialStateTypes = {
    isSidebarCollapsed: true,
    isDarkMode: false,
    isDataRefetchList: false,
    isTaskDetailsModalOpen: false,
    taskDetailsData: undefined,
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
        setIsTaskDetailsModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isTaskDetailsModalOpen = action.payload;
        },
        setTaskDetailsData: (
            state,
            action: PayloadAction<ITask | undefined>
        ) => {
            state.taskDetailsData = action.payload;
        },
    },
});

export const {
    setIsSidebarCollapsed,
    setIsDarkMode,
    setRefetchProjectTaskList,
    setIsTaskDetailsModalOpen,
    setTaskDetailsData,
} = globalSlice.actions;
export default globalSlice.reducer;
