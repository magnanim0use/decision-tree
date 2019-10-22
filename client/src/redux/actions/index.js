import {
	SHOW_NODE_OPTIONS,
	INIT_CREATE_NODE,
	CREATE_NODE,
	INIT_EDIT_NODE,
	EDIT_NODE,
	DELETE_NODE,
	INIT_MOVE_NODE,
	MOVE_NODE,
	CLOSE_MODAL,
	TOGGLE_NODE
} from './constants';

export const showNodeOptions = ({ 
	id, 
	position,  
	children,
	_children
}) => ({
	type: SHOW_NODE_OPTIONS,
	payload: {
		id,
		position,
		_children,
		children
	}
});

export const initCreateNode = parentId => ({
	type: INIT_CREATE_NODE,
	payload: {
		parentId
	}
});

export const createNode = ({ name, parentId, description }) => ({
	type: CREATE_NODE,
	payload: {
		name,
		description,
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

export const initMoveNode = id => ({
	type: INIT_MOVE_NODE,
	payload: {
		id
	}
});

export const moveNode = (id, parentId, newParentId) => ({
	type: MOVE_NODE,
	payload: {
		id,
		parentId,
		newParentId
	}
});

export const toggleNode = id => ({
	type: TOGGLE_NODE,
	payload: { id }
});

export const closeModal = () => ({
	type: CLOSE_MODAL
});
