import type { IAuthEmployeeResponse, ITask } from "../types/config.types";

import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface initialStateTypes {
    isSidebarCollapsed: boolean;
    isDarkMode: boolean;
    isDataRefetchList: boolean;
    isTaskDetailsModalOpen: boolean;
    taskDetailsData: ITask | undefined;
    authenticateEmployee: IAuthEmployeeResponse | null;
}

const initialState: initialStateTypes = {
    isSidebarCollapsed: true,
    isDarkMode: false,
    isDataRefetchList: false,
    isTaskDetailsModalOpen: false,
    taskDetailsData: undefined,
    authenticateEmployee: null,
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
        setAuthenticateEmployeeDetailsData: (
            state,
            action: PayloadAction<IAuthEmployeeResponse | null>
        ) => {
            state.authenticateEmployee = action.payload;
        },
    },
});

export const {
    setIsSidebarCollapsed,
    setIsDarkMode,
    setRefetchProjectTaskList,
    setIsTaskDetailsModalOpen,
    setTaskDetailsData,
    setAuthenticateEmployeeDetailsData,
} = globalSlice.actions;
export default globalSlice.reducer;
