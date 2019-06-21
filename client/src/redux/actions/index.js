import {
	ADD_NODE
} from './constants';

export const addNode = content => ({
	type: ADD_NODE,
	payload: {
		content
	}
});
