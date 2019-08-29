import * as d3 from 'd3'

export default class TreeGraph {

	constructor () {
		const bindObj = this;
		this.totalNodes = 0;
		this.maxLabelLength = 0;
		this.selectedNode = null;
		this.draggingNode = null;

		this.panSpeed = 200;
		this.panBoundary = 20;

		this.i = 0;
		this.duration = 750;

		this.viewerWidth = document.body.clientWidth;
		// this.viewerHeight = document.body.clientHeight;
		this.viewerHeight = 1200;

		this.tree = d3.tree().size([
			bindObj.viewerHeight,
			bindObj.viewerWidth
		]);

		this.baseSvg = d3.select('#decision-tree-container')
			.append('svg')
			.attr('width', bindObj.viewerWidth)
			.attr('height', bindObj.viewerHeight)
			.attr('class', 'overlay');
			// .call(bindObj.zoomListener);

		this.g = d3.select('#decision-tree-container svg')
			.append('g')
			.attr('transform', 'translate(80,0)');

		this.dragBehavior = this.dragListener();

		// this.zoomListener = d3.zoom()
		// 	.scaleExtent([
		// 		0.1,
		// 		3
		// 	])
		// 	.on(
		// 		'zoom',
		// 		bindObj.zoom(this.svgGroup)
		// 	);
	}

	render (treeData) {
		const bindObj = this;

		this.root = d3.hierarchy(treeData);

		this.root.x0 = this.viewerHeight / 2; //work with this
		this.root.y0 = 100; //should be dynamic

		this.update(this.root);
		// this.centerNode(this.root);
	}

	// sortTree (tree) {
	// 	this.tree.sort((a, b) => 
	// 		b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1
	// 	);
	// }

	//pan (node, direction, panSpeed = 200, panBoundary = 20) {
	// 	const translateCoords = transform();
	// }

	zoom (svgGroup) {
		// this.svgGroup
		// 	.attr(
		// 		'transform',
		// 		`translate(${d3.event.translate})scale(${d3.event.scale})`
		// 	);
	}

	// initiateDrag (draggingNode, domNode) {
	// 	const bindObj = this;

	// 	d3.select(domNode)
	// 		.select('.ghostCircle')
	// 		.attr('pointer-events', 'none');

	// 	d3.selectAll('.ghostCircle')
	// 		.attr('class', 'ghostCircle show');

	// 	d3.select(domNode)
	// 		.attr('class', 'node activeDrag')

	// 	this.g.selectAll('g.node')
	// 		.sort((a, b) => 
	// 			a.id !== draggingNode.id ? 1 : -1
	// 		);

	// 	if (this.nodes.length > 1) {
	// 		this.links = this.tree.links(this.nodes);
	// 		this.nodePaths = this.svgGroup
	// 			.selectAll('path.link')
	// 			.data(this.links, (d) => d.target.id)
	// 			.remove();

	// 		this.nodesExit = this.svgGroup.selectAll('g.node')
	// 			.data(this.nodes, (d) => d.id)
	// 			.filter((d, index) =>
	// 				d.id !== draggingNode
	// 			)
	// 			.remove();
	// 	}

	// 	const parentLink = this.tree.links(bindObj.tree.nodes(draggingNode.parent));
	// 	this.svgGroup.selectAll('path.link')
	// 		.filter((d, index) =>
	// 			d.target.id === draggingNode.id
	// 		)
	// 		.remove();

	// 	this.dragStarted = null;
	// }

	dragListener () {
		const bindObj = this;

		function dragStarted (node) {
			if (node === bindObj.root) {
				return;
			}

			bindObj.dragStarted = true;
			
			// node.x0 += d3.event.dy;
			// node.y0 += d3.event.dx;

			d3.select(this)
				.raise()
				.attr('stroke', 'black')
				// .attr(
				// 	'transform', 
				// 	(d) => `translate(${node.y0},${node.x0})`
				// );
		}

		function dragged (node) {
			if (node === bindObj.root) {
				return;
			}

			if (bindObj.dragStarted) {
				bindObj.domNode = this;

				d3.select(this)
					.select('.ghostCircle')
					.attr('pointer-events', 'none');

				d3.selectAll('.ghostCircle')
					.attr('class', 'ghostCircle show');

				d3.select(this)
					.attr('class', 'node activeDrag');

				const nodePaths = bindObj.g.selectAll('path.link')
					.data(
						bindObj.root.links(),
						(d) => d.target.id
					)
					.filter((d, i) => d.target.id === node.id)
					.remove();

				const nodeExit = bindObj.g.selectAll('g.node')
					.data(
						bindObj.root.descendants(),
						(d) => d.id
					)
					.filter((d, i) => d.id === node.id)
					.remove();

			}

			d3.select(this)
				.attr('cx', (d) => node.x = d3.event.x)
				.attr('cy', (d) => node.y = d3.event.y);
		}

		function dragEnded (node) {
			if (!bindObj.selectedNode) {
				return;
			}

			const index = node
				.parent
				.children
				.indexOf(node);

			if (index > -1) {
				node.parent
					.children
					.splice(index, 1);

				if (node.parent.children.length === 0) {
					node.parent.children = null;
				}
			}

			if (bindObj.selectedNode.children) {
				bindObj.selectedNode.children.push(node);
			} else if (bindObj.selectedNode._children) {
				bindObj.selectedNode._children.push(node);
			} else {
				bindObj.selectedNode.children = [ node ];
			}

			d3.selectAll('.ghostCircle')
				.attr('class', 'ghostCircle');

			d3.select(this)
				.attr('stroke', null);

			// this.root = d3.hierarchy(node.parent);
			bindObj.update(bindObj.root);
		}

		return {
			dragStarted,
			dragged,
			dragEnded
		};
	}

	overCircle (node) {
		this.selectedNode = node;
		// this.updateTempConnector();
	}

	outCircle () {
		this.selectedNode = null;
		// this.updateTempConnector();
	}

	updateTempConnector () {}

	centerNode (source) {
		const bindObj = this;

		// this.scale = this.zoomListener.scale();
		// const x = (-source.y0) * this.scale + this.viewerWidth / 2;
		// const y = (-source.x0) * this.scale + this.viewerHeight / 2;

		// d3.select('g')
		// 	.transition()
		// 	.duration(this.duration)
		// 	.attr(
		// 		'transform',
		// 		`translate(${x}, ${y})scale(${bindObj.scale})`
		// 	);

		// this.zoomListener.scale(this.scale);
		// this.zoomListener.traslate([ x, y ]);
	}

	toggleChildren (node) {
		if (node.children) {
			node._children = node.children;
			node.children = null;
		} else if (node._children) {
			node.children = node._children;
			node._children = null;
		}
	}

	click (data) {
		if (d3.event.defaultPrevented) {
			return;
		}

		this.toggleChildren(data);
		this.update(data);
	}

	update (source) {
		const bindObj = this;

		this.tree(this.root);
		this.root.each((d) => {
			d.y = d.depth * 200
		});

		const node = this.g.selectAll('.node')
			.data(
				bindObj.root.descendants(), 
				(d) => d.id || (d.id = ++bindObj.i)
			);

		const nodeEnter = node
			.enter()
			.append('g')
			.attr('class', 'node')
			.attr('transform', (d) => `translate(${source.y0}, ${source.x0})`)
			.on('click', bindObj.click.bind(bindObj))
			.call(
				d3.drag()
				.on('start', bindObj.dragBehavior.dragStarted)
				.on('drag', bindObj.dragBehavior.dragged)
				.on('end', bindObj.dragBehavior.dragEnded)
			);

		nodeEnter.append('circle')
			.attr('class', 'nodeCircle')
			.attr('r', 30)
			.style(
				'fill',
				(d) => d._children ? 'lightsteelblue' : '#fff'
			);

		nodeEnter.append('text')
			.attr('x', (d) => d.children || d._children ? -10 : 10)
			.attr('dy', '.35em')
			.attr('font-size', '150%')
			.attr('class', 'nodeText')
			.attr('text-anchor', (d) => d.children || d._children ? 'end' : 'start')
			.text((d) => d.data.name)
			.style('fill-opacity', 0);

		nodeEnter.append('circle')
			.attr('class', 'ghostCircle')
			.attr('r', 30)
			.attr('opacity', 0.2)
			.style('fill', 'red')
			.attr('pointer-events', 'mouseover')
			.on('mouseover', (node) => {
				bindObj.overCircle(node);
			})
			.on('mouseout', (node) => {
				bindObj.outCircle(node);
			});

		const nodeUpdate = nodeEnter.merge(node);

		nodeUpdate.transition()
			.duration(bindObj.duration)
			.attr(
				'transform',
				(d) => `translate(${d.y},${d.x})`
			);

		nodeUpdate.select('circle.nodeCircle')
			.attr('r', 4.5)
			.style(
				'fill', 
				(d) => d._children ? 'lightsteelblue' : '#fff'
			);

		nodeUpdate.select('text')
			.style('fill-opacity', 1);

		const nodeExit = node
			.exit()
			.transition()
			.duration(bindObj.duration)
			.attr(
				'transform',
				`translate(${source.y}, ${source.x})`
			)
			.remove();

		nodeExit.select('circle')
			.attr('r', 0);

		nodeExit.select('text')
			.style('fill-opacity', 0);

		const link = this.g.selectAll('.link')
    		.data(bindObj.root.links(), (d) => d.target.id);

		const linkEnter = link
			.enter()
			.insert('path', 'g')
			.attr('class', 'link')
			.attr('d', d3.linkHorizontal()
				.x((d) => source.y0)
				.y((d) => source.x0)
			);

		const linkUpdate = linkEnter.merge(link);

		linkUpdate
			.transition()
			.duration(bindObj.duration)
			.attr('d', d3.linkHorizontal()
				.x((d) => d.y)
				.y((d) => d.x)
			);

		link.exit()
			.transition()
			.duration(bindObj.duration)
			.attr('d', d3.linkHorizontal()
				.x((d) => source.y0)
				.y((d) => source.x0)
			)
			.remove();

		node.each((d) => {
			d.x0 = d.x;
			d.y0 = d.y
		});

		// const couplingParent1 = this.tree.nodes(this.root)
		// 	.filter((d) => d.name === 'cluster')[0];

		// const couplingChild1 = this.tree.nodes(this.root)
		// 	.filter((d) => d.name === 'JSONConverter')[0];

		// const multiParents = [
		// 	{
		// 		parent: couplingParent1,
		// 		child: couplingChild1
		// 	}
		// ];

		// multiParents.forEach((multiPair) => {
		// 	svgGroup.append('path', 'g')
		// 		.attr('class', 'additionalParentLink')
		// 		.attr('d', () => {
		// 			const oTarget = {
		// 				x: multiPair.parent.x0,
		// 				y: multiPair.parent.y0
		// 			};

		// 			const oSource = {
		// 				x: multiPair.child.x0,
		// 				y: multiPair.child.y0
		// 			};

		// 			return bindObj.diagonal({
		// 				source: oSource,
		// 				target: oTarget
		// 			});	
		// 		});
		// });
	}

}
