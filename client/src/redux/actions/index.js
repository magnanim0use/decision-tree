import {
	INIT_CREATE_NODE,
	CREATE_NODE,
	EDIT_NODE,
	DELETE_NODE,
	MOVE_NODE
} from './constants';

export const initCreateNode = parentId => ({
	type: INIT_CREATE_NODE,
	payload: {
		parentId
	}
});

export const createNode = (parentId) => ({
	type: CREATE_NODE,
	payload: {
		parentId
	}
});

export const editNode = id => ({
	type: EDIT_NODE,
	payload: {
		id
	}
});

export const deleteNode = id => ({
	type: DELETE_NODE,
	payload: {
		id
	}
});

export const moveNode = (id, oldParentId, newParentId) => ({
	type: MOVE_NODE,
	payload: {
		id,
		oldParentId,
		newParentId
	}
});
