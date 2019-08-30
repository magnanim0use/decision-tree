import {
	findNodeById
} from '../../helpers';

import {
	CREATE_NODE,
	MOVE_NODE,
	EDIT_NODE
} from '../actions/constants';

const treeMiddleware = store => next => action => {
	switch (action.type) {
		case CREATE_NODE:
			console.log('CREATE_NODE action:', action);
			const {
				payload: {
					name,
					parentId
				}
			} = action;

			const {
				tree: {
					data
				}
			} = store.getState();

			const parentNode = findNodeById(data, parentId);
			const newNode = {
				id: 100,
				name
			};

			parentNode.children && parentNode.children.length ? 
			  parentNode.children.push(newNode) :
			  parentNode.children = [ newNode ];

			console.log(parentNode);

			next(action);

		default:
			next(action);
	}
}

export default treeMiddleware;
