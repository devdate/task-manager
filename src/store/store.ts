import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./slices/taskSlice";
import { loadState, saveState } from "../utils/localstorage";

const preloadedState = loadState();

import { combineReducers } from "redux";

export const store = configureStore({
	reducer: combineReducers({
		tasks: taskReducer,
	}),
	preloadedState,
});

store.subscribe(() => {
	saveState({
		tasks: store.getState().tasks,
	});
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
