import {
	INIT_CREATE_NODE,
	CREATE_NODE,
	INIT_EDIT_NODE,
	EDIT_NODE,
	DELETE_NODE,
	MOVE_NODE,
	CLOSE_MODAL
} from './constants';

export const initCreateNode = parentId => ({
	type: INIT_CREATE_NODE,
	payload: {
		parentId
	}
});

export const createNode = ({ name, parentId }) => ({
	type: CREATE_NODE,
	payload: {
		name,
		parentId
	}
});

export const initEditNode = id => ({
	type: INIT_EDIT_NODE,
	payload: {
		id
	}
});

export const editNode = ({ id, name, description, status }) => ({
	type: EDIT_NODE,
	payload: {
		id,
		name,
		description,
		status
	}
});

export const deleteNode = ({ id, parentId }) => ({
	type: DELETE_NODE,
	payload: {
		id,
		parentId
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

export const closeModal = () => ({
	type: CLOSE_MODAL
});
