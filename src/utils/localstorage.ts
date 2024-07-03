export const loadState = () => {
	try {
		const serializedState = localStorage.getItem("taskManagerState");
		if (serializedState === null) {
			return undefined;
		}
		return JSON.parse(serializedState);
	} catch (err) {
		console.error("Could not load state", err);
		return undefined;
	}
};

export const saveState = (state: any) => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem("taskManagerState", serializedState);
	} catch (err) {
		console.error("Could not save state", err);
	}
};
