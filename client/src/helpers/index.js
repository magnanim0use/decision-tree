export function findNodeById (treeData, id) {
	let node;

	visit(
		treeData,
		(d) => {
			if (d.id === id) {
				node = d;
			}
		}
	)

	return d;
}

export function traverseTree (treeData, iterator) {
	iterator(treeData);

	function traverseChildren (node) {
		return node.children && node.children.length > 0 ? node.children : null
	}

	const children = traverseChildren(parent);
	
	if (children) {
	    children.forEach((child) => traverseTree(
	    	child,
	    	iterator
	    ));
	}
}
