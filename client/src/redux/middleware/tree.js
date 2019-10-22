import {
	findNodeById,
	getMaxId
} from '../../helpers';

import {
	CREATE_NODE,
	MOVE_NODE,
	EDIT_NODE,
	DELETE_NODE,
	TOGGLE_NODE
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
					description,
					parentId
				}
			} = action;

			const parentNode = findNodeById(data, parentId);
			const maxId = getMaxId(data);

			const newNode = {
				id: maxId + 1,
				name,
				description
			};

			const isCollapsed = parentNode._children && parentNode._children.length;
			const childProp = isCollapsed ? '_children' : 'children';

			parentNode[ childProp ] && parentNode[ childProp ].length ? 
			  parentNode[ childProp ].push(newNode) :
			  parentNode[ childProp ] = [ newNode ];

			 Object.assign(
			 	action.payload,
			 	{
			 		id: newNode.id
			 	}
			 );

			return next(action);
		}

		case EDIT_NODE: {
			const {
				payload: {
					id,
					name,
					description,
					status
				}
			} = action;

			const nodeDataObject = findNodeById(data, id);

			Object.assign(
				nodeDataObject,
				{
					name,
					description,
					status
				}
			);

			return next(action);
		}

		case DELETE_NODE: {
			const {
				payload: {
					id,
					parentId
				}
			} = action;

			const parentNodeDataObject = findNodeById(data, parentId);

			const deletedNodeIndex = parentNodeDataObject
				.children
				.findIndex((childNode) => childNode.id === id);

			parentNodeDataObject
				.children
				.splice(deletedNodeIndex, 1);

			return next(action);
		}

		case TOGGLE_NODE: {
			const {
				payload: {
					id
				}
			} = action;

			const nodeDataObject = findNodeById(data, id);
			const { 
				children,
				_children
			} = nodeDataObject;

			if (children && children.length) {
				nodeDataObject._children = children;
				nodeDataObject.children = null;
			} else if (_children && _children.length) {
				nodeDataObject.children = _children;
				nodeDataObject._children = null;
			}

			return next(action);
		}

		case MOVE_NODE: {
			const {
				payload: {
					id,
					parentId,
					newParentId
				}
			} = action;

			const nodeDataObject = findNodeById(data, id);
			const originalParentNodeDataObject = findNodeById(data, parentId);
			const newParentNodeDataObject = findNodeById(data, newParentId);

			const isCollapsed = newParentNodeDataObject._children && newParentNodeDataObject._children.length;
			const childProp = isCollapsed ? '_children' : 'children';

			const childNodeIndex = originalParentNodeDataObject
				.children
				.findIndex((childNode) => childNode.id === nodeDataObject.id);

			originalParentNodeDataObject
				.children
				.splice(childNodeIndex, 1);

			if (newParentNodeDataObject[ childProp ] && newParentNodeDataObject[ childProp ].length) {
				newParentNodeDataObject
					[ childProp ]
					.push(nodeDataObject);
			} else {
				newParentNodeDataObject[ childProp ] = [ nodeDataObject ];
			}

			return next(action);
		}

		default:
			return next(action);
	}
}

export default treeMiddleware;
