export function findNodeById (treeData, id) {
	let node;

	traverseTree(
		treeData,
		(d) => {
			const {
				data
			} = d;

			if (data && data.id === id) {
				node = d;
			} else if (d.id === id) {
				node = d;
			}
		}
	)

	return node;
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

export function hasTreeChanged (originalTreeData, newTreeData) {
	let hasChanged = false;

	traverseTree(
		originalTreeData,
		(d1) => {
			traverseTree(
				newTreeData,
				(d2) => {
					if (d2 !== d1) {
						hasChanged = true;
					}
				}
			)
		}
	);

	return hasChanged;
}

export function traverseTree (treeData, iterator) {
	iterator(treeData);

	function traverseChildren (node) {
		return node.children && node.children.length > 0 ? node.children : null
	}

	const children = traverseChildren(treeData);
	
	if (children) {
	    children.forEach((child) => traverseTree(
	    	child,
	    	iterator
	    ));
	}
}
