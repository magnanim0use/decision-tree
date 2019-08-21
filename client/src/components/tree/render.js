import * as d3 from 'd3'

// export default function render () {
// 	console.log(d3.svg())
// }

let totalNodes = 0;
let maxLabelLength = 0;
let selectedNode = null;
let draggingNode = null;

let panSpeed = 200;
let panBoundary = 20;

let i = 0;
const duration = 750;
let root;
let nodes;
let links;
let nodePaths;
let nodesExit;
let dragStarted;
let domNode;
let scale;
let node;
let d;

const viewerWidth = document.body.clientWidth;
const viewerHeight = document.body.clientHeight;

const tree = d3.tree().size([
	viewerHeight,
	viewerWidth
]);

// const diagonal = d3.svg.diagonal()
// 	.projection((d) => [ d.y, d.x ]);

const diagonal = d3.linkHorizontal()
  .x((d) => d.x)
  .y((d) => d.y);

const zoomListener = d3.zoom()
	.scaleExtent([
		0.1,
		3
	])
	.on(
		'zoom',
		zoom
	);

const baseSvg = d3.select('#decision-tree-container')
	.append('svg')
	.attr({
		width: viewerWidth,
		height: viewerHeight,
		class: 'overlay',
	})
	.call(zoomListener);

const svgGroup = baseSvg.append('g');

// const baseSvg = select('#decision-tree-container')
// 	.append('svg')
// 	.attr('width', width)
// 	.attr('height', height)
// 	.attr('class', 'overlay')
// 	.call(zoomListener);


export default function render (treeData) {
	visit(treeData, (d) => {
		totalNodes++;
		maxLabelLength = Math.max(
			d.name.length,
			maxLabelLength
		);
	}, ({ children }) => 
		children && children.length > 0 ? children : null
	);

	root = treeData;
	root.x0 = viewerHeight / 2;
	root.y0 = 0;

	sortTree();
	update(root);
	centerNode(root);
}


export function visit (parent, visitFn, subNodeFn) {
	if (!parent) {
		return;
	}

	visitFn(parent);
	const subNodes = subNodeFn(parent);

	if (subNodes) {
		subNodes.forEach((subNode) => visit(
			subNode,
			visitFn,
			subNodeFn
		));
	}
}

export function sortTree (tree) {
	tree.sort((a, b) => 
		b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1
	);
}

// export function pan (node, direction, panSpeed = 200, panBoundary = 20) {
// 	const translateCoords = transform();
// }

// export function zoom (svgGroup) {
// 	svgGroup.attr(
// 		'transform',
// 		`translate(${event})scale(${event.scale})`
// 	);
// }

export function zoom () {
	svgGroup
		.attr(
			'transform',
			`translate("${d3.event.translate}")scale("${d3.event.scale}")`
		);
}

export function initiateDrag (draggingNode, domNode) {
	d3.select(domNode)
		.select('.ghostCircle')
		.attr('pointer-events', 'none');

	d3.selectAll('.ghostCircle')
		.attr('class', 'node activeDrag');

	svgGroup
		.selectAll('g.node')
		.sort((a, b) => 
			a.id !== draggingNode.id ? 1 : -1
		);

	if (nodes.length > 1) {
		links = tree.links(nodes);
		nodePaths = svgGroup.selectAll('path.link')
						.data(links, (d) => d.target.id)
						.remove();

		nodesExit = svgGroup.selectAll('g.node')
						.data(nodes, (d) => d.id)
						.filter((d, index) =>
							d.id !== draggingNode
						).remove();
	}

	const parentLink = tree.links(tree.nodes(draggingNode.parent));
	svgGroup.selectAll('path.link')
		.filter((d, index) =>
			d.target.id === draggingNode.id
		).remove();

	dragStarted = null;
}

const dragListener = d3.drag()
						.on('dragstart', (d) => {
							if (d === root) {
								return;
							}

							dragStarted = true;
							nodes = tree.nodes(d);
							d3.event.sourceEvent.stopPropogations();
						})
						.on('drag', (d) => {
							if (d === root) {
								return;
							}

							if (dragStarted) {
								domNode = this;
								initiateDrag(d, domNode);
							}

							// const relCoords = d3.mouse(
							// 	document.getElementsByTagName('svg')[0]
							// );

							// if (relCoords[0] < panBoundary) {
							//     panTimer = true;
							//     pan(this, 'left');
							// } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

							//     panTimer = true;
							//     pan(this, 'right');
							// } else if (relCoords[1] < panBoundary) {
							//     panTimer = true;
							//     pan(this, 'up');
							// } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
							//     panTimer = true;
							//     pan(this, 'down');
							// } else {
							//     try {
							//         clearTimeout(panTimer);
							//     } catch (e) {

							//     }
							// }

							d.x0 += d3.event.dy;
							d.y0 += d3.event.dx;

							const node = d3.select(this);
							node.attr(
								'transform',
								`translate("${d.y0}, ${d.xo}")`
							);

							updateTempConnector();
						})
						.on('dragend', (d) => {
							if (d === root) {
								return;
							}

							domNode = this;

							if (selectedNode) {
								const index = draggingNode
												.parent
												.children
												.indexOf(draggingNode);

								if (index > -1) {
									draggingNode
										.parent
										.children
										.splice(index, 1);
								}

								if (
									typeof selectedNode.children !== 'undefined' ||
									typeof selectedNode._children !== 'undefined'
								) {
									if (typeof selectedNode.children !== 'undefined') {
										selectedNode.children.push(draggingNode);
									} else {
										selectedNode._children.push(draggingNode);
									}
								} else {
									selectedNode.children = [ draggingNode ];
								}

								expand(selectedNode);
								sortTree();
								endDrag();
							} else {
								endDrag();
							}
						});

export function endDrag () {
	selectedNode = null;

	d3.selectAll('.ghostCircle')
		.attr('class', 'ghostCircle');

	d3.select(domNode).attr('class', 'node');
	d3.select(domNode)
		.select('.ghostCircle')
		.attr('pointer-events', '');

	updateTempConnector();

	if (draggingNode !== null) {
		update(root);
		centerNode(draggingNode);
		draggingNode = null;
	}
}

export function collapse ({ children, _children }) {
	if (children) {
		_children = children;
		_children.forEach(collapse);
		children = null;
	}
} 

export function expand ({ children, _children }) {
	if (_children) {
		children = _children;
		children.forEach(expand);
		_children = null;
	}
} 

export function overCircle (node) {
	selectedNode = node;
	updateTempConnector();
}

export function outCircle () {
	selectedNode = null;
	updateTempConnector();
}

export function updateTempConnector () {

}

export function centerNode (source) {
	scale = zoomListener.scale();
	const x = (-source.y0) * scale + viewerWidth / 2;
	const y = (-source.x0) * scale + viewerHeight / 2;

	d3.select('g')
		.transition()
		.duration(duration)
		.attr(
			'transform',
			`translate(${x}, ${y})scale(${scale})`
		);

	zoomListener.scale(scale);
	zoomListener.traslate([ x, y ]);
}

export function toggleChildren (node) {
	if (node.children) {
		node._children = node.children;
		node.children = null;
	} else {
		node.children = node._children;
		node._children = null;
	}

	return node;
}

export function click (data) {
	if (d3.event.defaultPrevented) {
		return;
	}

	data = toggleChildren(data);
	update(data);
	centerNode(data);
}

export function update (source) {
	const levelWidth = [1];
	
	function childCount (level, n) {
		if (n.children && n.children.length > 0) {
			if (levelWidth.length <= level + 1) {
				levelWidth.push(0);
			}

			levelWidth[ level - 1 ] += n.children.length;
			n.children.forEach((d) => {
				childCount(level + 1, d);
			}); 
		}
	}

	childCount(0, root);
	const newHeight = d3.max(levelWidth) * 25;

	tree = tree.size([ newHeight, viewerWidth ]);

	const nodes = tree.nodes(root).reverse();
	const links = tree.links(nodes);

	nodes.forEach((d) =>{
		d.y = d(d.depth * (maxLabelLength * 10));
	});

	node = svgGroup.selectAll('g.node')
			.data(
				nodes, 
				(d) => d.id || (d.id = ++ i)
			);

	const nodeEnter = node.enter().append('g')
		.call(dragListener)
		.attr({
			class: 'node',
			transform: (d) => `translate("${source.y0}", "${source.xo}")`
		})
		.on('click', click);

	nodeEnter.append('circle')
		.attr({
			r: 0,
			class: 'nodeCircle'
		})
		.style(
			'fill',
			(d) => d._children ? 'lightsteelblue' : '#fff'
		);

	nodeEnter.append('text')
		.attr({
			x: (d) => d.children || d._children ? -10 : 10,
			dy: '.35em',
			class: 'nodeText',
			'text-anchor': (d) => d.children || d._children ? 'end' : 'start'
		})
		.text((d) => d.name)
		.style('fill-opacity', 0);

	nodeEnter.append('circle')
		.attr({
			class: 'ghostCircle',
			r: 30,
			opacity: 0.2,
			'pointer-events': 'mouseover'
		})
		.style('fill', 'red')
		.on('mouseover', (node) => overCircle(node))
		.on('mouseout', (node) => outCircle(node));

	node.select('text')
		.attr({
			x: (d) => d.children || d._children ? -10 : 10,
			'text-anchor': (d) => d.children || d._children ? 'end' : 'start'
		})
		.text((d) => d.name);

	node.select('circle.nodeCircle')
		.attr('r', 4.5)
		.style(
			'fill', 
			(d) => d.children ? 'lightsteelblue' : '#fff'
		);

	const nodeUpdate = node.transition()
		.duration(duration)
		.attr(
			'transform',
			`translate("${d.y}", "${d.x}")`
		);

	nodeUpdate.select('text')
		.style('fill-opacity', 1);

	const nodeExit = node.exit().transition()
		.duration(duration)
		.attr(
			'transform',
			`translate("${source.y}", "${source.x}")`
		)
		.remove();

	nodeExit.select('circle')
		.attr('r', 0);

	nodeExit.select('text')
		.style('fill-opacity', 0);

	const link = svgGroup.selectAll('path.link')
		.data(links,  (d) => d.target.id);

	link.enter().insert('path', 'g')
		.attr({
			class: 'link',
			d: (d) => {
				const o = {
					x: source.x0,
					y: source.y0
				}

				return diagonal({
					source: o,
					target: o
				});
			}
		});

	link.transition()
		.duration(duration)
		.attr('d', diagonal);

	link.exit().transition()
		.duration(duration)
		.attr('d', (d) => {
			const o = {
				x: source.x,
				y: source.y
			}

			return diagonal({
				source: o,
				target: o
			});
		})
		.remove();

	nodes.forEach((d) => {
		d.x0 = d.x;
		d.y0 = d.y;
	});

	const svgGroup = baseSvg.append('g');

	root = source;
	root.x0 = viewerHeight / 2;
	root.y0 = 0;

	update(root);
	centerNode(root);

	const couplingParent1 = tree.nodes(root)
		.filter((d) => d.name === 'cluster')[0];

	const couplingChild1 = tree.nodes(root)
		.filter((d) => d.name === 'JSONConverter')[0];

	const multiParents = [
		{
			parent: couplingParent1,
			child: couplingChild1
		}
	];

	multiParents.forEach((multiPair) => {
		svgGroup.append('path', 'g')
			.attr({
				class: 'additionalParentLink',
				d: () => {
					const oTarget = {
						x: multiPair.parent.x0,
						y: multiPair.parent.y0
					};

					const oSource = {
						x: multiPair.child.x0,
						y: multiPair.child.y0
					};

					return diagonal({
						source: oSource,
						target: oTarget
					});	
				}
			});
	});
}


