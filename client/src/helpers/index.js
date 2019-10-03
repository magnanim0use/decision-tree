export function findNodeById (treeData, id) {
	let node;

	traverseTree(
		treeData,
		(d) => {
			const {
				data
			} = d;

			/*
				If D3 data (raw data processed using D3), each node will have a data property. 
				If it is just the raw data, it will be a regular object.
			*/

			if (data) {
				if (data.id === id) {
					node = d
				}
			} else if (d.id === id) {
				node = d;
			}
		}
	)

	return node || {};
}

export function getChildCount (node) {
	let count = 0;

	if (!node._children) {
		return count;
	}

	traverseTree(
		node,
		(d) => {
			const {
				children,
				_children
			} = d;

			if (children && children.length) {
				count += children.length;
			}

			if (_children && _children.length) {
				count += _children.length
			}
		}
	);

	return count;
}

export function getMaxId (treeData) {
	let maxId = 0;

	traverseTree(
		treeData,
		(d) => {
			if (d.id > maxId) {
				maxId = d.id;
			}
		}
	);

	return maxId;
}

export function traverseTree (treeData, iterator) {
	iterator(treeData);

	function traverseChildren (node) {
		const {
			children,
			_children
		} = node;

		let allChildren = [];

		if (children && children.length) {
			allChildren = allChildren.concat(children);
		}

		if (_children && _children.length) {
			allChildren = allChildren.concat(_children);
		}

		return allChildren.length ? allChildren : null;
	}

	const children = traverseChildren(treeData);
	
	if (children) {
	    children.forEach((child) => traverseTree(
	    	child,
	    	iterator
	    ));
	}
}
