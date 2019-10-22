export const saveState = (state) => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('state', serializedState);
	} catch {}
}

export const getState = () => {
	try {
		const serializedState = localStorage.getItem('state');

		if (serializedState === null) {
			return undefined;
		}

		return JSON.parse(serializedState);
	} catch {
		return undefined;
	}
}
