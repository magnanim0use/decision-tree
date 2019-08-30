export function findNodeById (treeData, id) {
	let node;

	traverseTree(
		treeData,
		(d) => {
			console.log(d, id)
			if (d.id === id) {
				node = d;
			}
		}
	)

	return node;
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
