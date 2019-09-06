import {
	findNodeById,
	getMaxId
} from '../../helpers';

import {
	CREATE_NODE,
	MOVE_NODE,
	EDIT_NODE
} from '../actions/constants';

const treeMiddleware = store => next => action => {
	const {
		tree: {
			data
		}
	} = store.getState();

	switch (action.type) {
		case CREATE_NODE: {
			const {
				payload: {
					name,
					parentId
				}
			} = action;

			const parentNode = findNodeById(data, parentId);
			const maxId = getMaxId(data);

			const newNode = {
				id: maxId + 1,
				name
			};

			parentNode.children && parentNode.children.length ? 
			  parentNode.children.push(newNode) :
			  parentNode.children = [ newNode ];

			return next(action);
		}

		case MOVE_NODE: {
			const {
				payload: {
					id,
					oldParentId,
					newParentId
				}
			} = action;

			const nodeDataObject = findNodeById(data, id);
			const originalParentNodeDataObject = findNodeById(data, oldParentId);
			const newParentNodeDataObject = findNodeById(data, newParentId)

			const childNodeIndex = originalParentNodeDataObject
				.children
				.findIndex((childNode) => childNode.id === nodeDataObject.id);

			originalParentNodeDataObject
				.children
				.splice(childNodeIndex, 1);

			if (newParentNodeDataObject.children && newParentNodeDataObject.children.length) {
				newParentNodeDataObject
					.children
					.push(nodeDataObject);
			} else {
				newParentNodeDataObject.children = [ nodeDataObject ];
			}

			return next(action);
		}

		default:
			return next(action);
	}
}

export default treeMiddleware;
