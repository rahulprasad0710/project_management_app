import { useDispatch, useSelector } from "react-redux";

import type { AppStore } from "./StoreProvider";
import type { TypedUseSelectorHook } from "react-redux";

/* REDUX HOOKS */
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
