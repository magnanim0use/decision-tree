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

		this.svgGroup = this.baseSvg.append('g');
		this.zoomListener = d3.zoom()
			.scaleExtent([
				0.1,
				3
			])
			.on(
				'zoom',
				bindObj.zoom(this.svgGroup)
			);

		this.baseSvg.call(bindObj.zoomListener.bind(bindObj));
		// this.diagonal = d3.linkHorizontal()
		//   .x((d) => d.x)
		//   .y((d) => d.y);

		this.diagonal = function link(d) {
  return "M" + d.source.y + "," + d.source.x
      + "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x
      + " " + (d.source.y + d.target.y) / 2 + "," + d.target.x
      + " " + d.target.y + "," + d.target.x;
}
	}

	render (treeData) {
		const bindObj = this;

		// this.sortTree();
		this.treeData = treeData;

		this.root = d3.hierarchy(
			bindObj.treeData, 
			(d) => d.children
		);

		this.root.x0 = this.viewerHeight / 4; //work with this
		this.root.y0 = 100; //should be dynamic

		this.update(this.root);
		this.centerNode(this.root);
		this.dragListener();

		// this.totalNodes = 0;
		bindObj.visit(treeData, (d) => {
			bindObj.totalNodes++;
			bindObj.maxLabelLength = Math.max(
				d.name.length,
				bindObj.maxLabelLength
			);
		}, ({ children }) => 
			children && children.length > 0 ? children : null
		);
	}

	visit (parent, visitFn, subNodeFn) {
		const bindObj = this;
		if (!parent) {
			return;
		}

		visitFn(parent);
		const subNodes = subNodeFn(parent);

		if (subNodes) {
			subNodes.forEach((subNode) => bindObj.visit(
				subNode,
				visitFn,
				subNodeFn
			));
		}
	}

	sortTree (tree) {
		this.tree.sort((a, b) => 
			b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1
		);
	}

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

	initiateDrag (draggingNode, domNode) {
		const bindObj = this;
		d3.select(domNode)
			.select('.ghostCircle')
			.attr('pointer-events', 'none');

		d3.selectAll('.ghostCircle')
			.attr('class', 'ghostCircle show');

		d3.select(domNode)
			.attr('class', 'node activeDrag')

		this.svgGroup
			.selectAll('g.node')
			.sort((a, b) => 
				a.id != draggingNode.id ? 1 : -1
			);

		if (this.nodes.length > 1) {
			this.links = this.tree.links(this.nodes);
			this.nodePaths = this.svgGroup
				.selectAll('path.link')
				.data(this.links, (d) => d.target.id)
				.remove();

			this.nodesExit = this.svgGroup.selectAll('g.node')
				.data(this.nodes, (d) => d.id)
				.filter((d, index) =>
					d.id != draggingNode
				)
				.remove();
		}

		const parentLink = this.tree.links(bindObj.tree.nodes(draggingNode.parent));
		this.svgGroup.selectAll('path.link')
			.filter((d, index) =>
				d.target.id === draggingNode.id
			)
			.remove();

		this.dragStarted = null;
	}

	dragListener () {
		const bindObj = this;
		d3.drag()
			.on('start', (d) => {
				if (d === bindObj.root) {
					return;
				}

				bindObj.dragStarted = true;
				bindObj.nodes = bindObj.tree.nodes(d);
				d3.event.sourceEvent.stopPropogations();
			})
			.on('drag', (d) => {
				if (d === bindObj.root) {
					return;
				}

				if (bindObj.dragStarted) {
					bindObj.domNode = this;
					bindObj.initiateDrag(d, bindObj.domNode);
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
					`translate(${d.y0}, ${d.x0})`
				);

				bindObj.updateTempConnector();
			})
			.on('end', (d) => {
				if (d === bindObj.root) {
					return;
				}

				bindObj.domNode = this;

				if (bindObj.selectedNode) {
					const index = bindObj.draggingNode
									.parent
									.children
									.indexOf(bindObj.draggingNode);

					if (index > -1) {
						bindObj.draggingNode
							.parent
							.children
							.splice(index, 1);
					}

					if (
						typeof bindObj.selectedNode.children !== 'undefined' ||
						typeof bindObj.selectedNode._children !== 'undefined'
					) {
						if (typeof bindObj.selectedNode.children !== 'undefined') {
							bindObj.selectedNode.children.push(bindObj.draggingNode);
						} else {
							bindObj.selectedNode._children.push(bindObj.draggingNode);
						}
					} else {
						bindObj.selectedNode.children = [ bindObj.draggingNode ];
					}

					bindObj.expand(bindObj.selectedNode);
					bindObj.sortTree();
					bindObj.endDrag();
				} else {
					bindObj.endDrag();
				}
			});
	}

	endDrag () {
		const bindObj = this;
		this.selectedNode = null;

		d3.selectAll('.ghostCircle')
			.attr('class', 'ghostCircle');

		d3.select(bindObj.domNode).attr('class', 'node');
		d3.select(bindObj.domNode)
			.select('.ghostCircle')
			.attr('pointer-events', '');

		this.updateTempConnector();

		if (this.draggingNode !== null) {
			this.update(this.root);
			this.centerNode(this.draggingNode);
			this.draggingNode = null;
		}
	}

	collapse ({ children, _children }) {
		const bindObj = this;
		if (children) {
			_children = children;
			_children.forEach(bindObj.collapse);
			children = null;
		}
	}

	expand ({ children, _children }) {
		const bindObj = this;
		if (_children) {
			children = _children;
			children.forEach(bindObj.expand);
			_children = null;
		}
	}

	overCircle (node) {
		this.selectedNode = node;
		this.updateTempConnector();
	}

	outCircle () {
		this.selectedNode = null;
		this.updateTempConnector();
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

		return node;
	}

	click (data) {
		if (d3.event.defaultPrevented) {
			return;
		}

		data = this.toggleChildren(data);
		this.update(data);
		this.centerNode(data);
	}

	update (source) {
		const bindObj = this;
		const levelWidth = [1];
		
		// function childCount (level, n) {
		// 	if (n.children && n.children.length > 0) {
		// 		if (levelWidth.length <= level + 1) {
		// 			levelWidth.push(0);
		// 		}

		// 		levelWidth[ level - 1 ] += n.children.length;
		// 		n.children.forEach((d) => {
		// 			childCount(level + 1, d);
		// 		}); 
		// 	}
		// }

		// childCount(0, this.root);
		const newHeight = d3.max(levelWidth) * 25;

		// this.tree = this.tree.size([ bindObj.newHeight, bindObj.viewerWidth ]);

		// const nodes = this.tree.nodes(this.root).reverse();
		// const links = this.tree.links(nodes);

		const treemap = this.tree(this.root);

		// Compute the new tree layout.
		this.nodes = treemap.descendants();
		this.links = treemap.descendants().slice(1);

		this.nodes.forEach((d) => {
			d.y = (d.depth * (bindObj.maxLabelLength * 10));
		});

		this.node = this.svgGroup.selectAll('g.node')
			.data(
				bindObj.nodes, 
				(d) => d.id || (d.id = ++bindObj.i)
			);

		const nodeEnter = this.node.enter().append('g')
			.call(bindObj.dragListener.bind(bindObj))
			.attr('class', 'node')
			.attr('transform', (d) => `translate(${source.y0}, ${source.x0})`)
			.on('click', bindObj.click.bind(bindObj));

		nodeEnter.append('circle')
			.attr('class', 'nodeCircle')
			.attr('r', 0)
			.style(
				'fill',
				(d) => d._children ? 'lightsteelblue' : '#fff'
			);

		nodeEnter.append('text')
			.attr('x', (d) => d.children || d._children ? -10 : 10)
			.attr('dy', '.35em')
			.attr('class', 'nodeText')
			.attr('text-anchor', (d) => d.children || d._children ? 'end' : 'start')
			.text((d) => d.name)
			.style('fill-opacity', 0);

		nodeEnter.append('circle')
			.attr('class', 'ghostCircle')
			.attr('r', 30)
			.attr('opacity', 0.2)
			.attr('pointer-events', 'mouseover')
			// .style('fill', 'red')
			// .on('mouseover', (node) => this.overCircle(node).bind(bindObj))
			// .on('mouseout', (node) => this.outCircle(node).bind(bindObj));

		this.node.select('text')
			.attr('x', (d) => d.children || d._children ? -10 : 10)
			.attr('text-anchor', (d) => d.children || d._children ? 'end' : 'start')
			.text((d) => d.name);

		this.node.select('circle.nodeCircle')
			.attr('r', 4.5)
			.style(
				'fill', 
				(d) => d._children ? 'lightsteelblue' : '#fff'
			);

		const nodeUpdate = this.node.transition()
			.duration(bindObj.duration)
			.attr(
				'transform',
				(d) => `translate(${d.y}, ${d.x})`
			);

		nodeUpdate.select('text')
			.style('fill-opacity', 1);

		const nodeExit = this.node.exit().transition()
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

		// this.links = this.tree(this.root).links(this.nodes);

		const link = this.svgGroup.selectAll('path.link')
			.data(this.links);

		link.enter().insert('path', 'g')
			.attr('class', 'link')
			.attr('d', (d) => {
				const o = {
					x: source.x0,
					y: source.y0
				}

				return bindObj.diagonal({
					source: o,
					target: o
				});
			});

		link.transition()
			.duration(bindObj.duration)
			.attr('d', bindObj.diagonal);

		link.exit().transition()
			.duration(bindObj.duration)
			.attr('d', (d) => {
				const o = {
					x: source.x,
					y: source.y
				}

				return bindObj.diagonal({
					source: o,
					target: o
				});
			})
			.remove();

		this.nodes.forEach((d) => {
			d.x0 = d.x;
			d.y0 = d.y;
		});

		const svgGroup = this.baseSvg.append('g');

		this.root = source;
		this.root.x0 = this.viewerHeight / 2;
		this.root.y0 = 0;

		// this.update(this.root);
		this.centerNode(this.root);

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
