import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
	id: string;
	title: string;
	description: string;
	dueDate: string;
	priority: string;
	completed: boolean;
}

export interface ITaskState {
	// Export the interface
	tasks: Task[];
}

const initialState: ITaskState = {
	tasks: [],
};

const taskSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		addTask: (state, action: PayloadAction<Task>) => {
			state.tasks.push(action.payload);
		},
		editTask: (state, action: PayloadAction<Task>) => {
			const index = state.tasks.findIndex((task) => task.id === action.payload.id);
			if (index !== -1) {
				state.tasks[index] = action.payload;
			}
		},
		deleteTask: (state, action: PayloadAction<string>) => {
			state.tasks = state.tasks.filter((task) => task.id !== action.payload);
		},
		toggleComplete: (state, action: PayloadAction<string>) => {
			const index = state.tasks.findIndex((task) => task.id === action.payload);
			if (index !== -1) {
				state.tasks[index].completed = !state.tasks[index].completed;
			}
		},
	},
});

export const { addTask, editTask, deleteTask, toggleComplete } = taskSlice.actions;
export default taskSlice.reducer;
