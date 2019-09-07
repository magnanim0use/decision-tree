import * as d3 from 'd3'

import {
	INIT_CREATE_NODE,
	MOVE_NODE
} from '../../redux/actions/constants';

export default class TreeGraph {

	constructor ({ dispatch }) {
		const bindObj = this;
		this.totalNodes = 0;
		this.maxLabelLength = 0;
		this.selectedNode = null;
		this.draggingNode = null;

		this.dispatch = dispatch;

		this.panSpeed = 200;
		this.panBoundary = 20;

		this.i = 0;
		this.duration = 750;

		this.viewerWidth = document.body.clientWidth;
		// this.viewerHeight = document.body.clientHeight;
		this.viewerHeight = 400;

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
		const {
			data,
			// activeNode
		} = treeData;

		this.treeData = data;
		this.root = d3.hierarchy(this.treeData);
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
				// 	(d) => `translate(${d.y0},${d.x0})`
				// );
		}

		function dragged (node) {
			if (bindObj.dragStarted) {
				bindObj.domNode = this;

				d3.select(this)
					.select('.ghostCircle')
					.attr('pointer-events', 'none');

				d3.selectAll('.ghostCircle')
					.attr('class', 'ghostCircle show');

				d3.select(this)
					.attr('class', 'node activeDrag');

				bindObj.g.selectAll('path.link')
					.data(
						bindObj.root.links(),
						(d) => d.target.id
					)
					.filter((d, i) => d.target.id === node.id)
					.remove();

				bindObj.g.selectAll('g.node')
					.data(
						bindObj.root.descendants(),
						(d) => d.id
					)
					.filter((d, i) => d.id === node.id)
					.remove();

				d3.select(this)
					.attr('cx', (d) => node.x = d3.event.x)
					.attr('cy', (d) => node.y = d3.event.y);
			}
		}

		function dragEnded (node) {
			d3.selectAll('.ghostCircle')
				.attr('class', 'ghostCircle');

			if (!bindObj.selectedNode) {
				return bindObj.update(node);
			}

			bindObj.moveNode(
				node,
				bindObj.selectedNode
			);

			d3.select(this)
				.attr('stroke', null);
		}

		return {
			dragStarted,
			dragged,
			dragEnded
		};
	}

	dispatchActions (action) {
		this.dispatch(action);
	}

	initCreateNode (node) {
		this.dispatchActions({
			type: INIT_CREATE_NODE,
			payload: {
				parentId: node.data.id
			}
		});
	}

	moveNode(node, newParentNode) {
		this.dispatchActions({
			type: MOVE_NODE,
			payload: {
				id: node.data.id,
				oldParentId: node.parent.data.id,
				newParentId: newParentNode.data.id
			}
		});
	}

	initEditNode(node) {
		console.log('INIT_EDIT_NODE');
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
		// const bindObj = this;

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

	click (node) {
		if (d3.event.defaultPrevented) {
			return;
		}

		this.toggleChildren(node);
		this.update(node);

		// this.dispatchActions({
		// 	type: 'INIT_EDIT_NODE',
		// 	payload: {
		// 		id: node.data.id
		// 	}
		// });
	}

	mouseDown (node) {
		const bindObj = this;
		this.mouseIsHeld = true;
		setTimeout(() => {
			if (!this.mouseIsHeld) {
				return;
			}

			bindObj.initEditNode(node);
		}, 300);
	}

	mouseUp (node) {
		console.log('mouseUp!')
		this.mouseIsHeld = false;
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
			.on('dblclick', bindObj.initCreateNode.bind(bindObj))
			// .on('mouseup', bindObj.mouseUp.bind(bindObj))
			// .on('mousedown', bindObj.mouseDown.bind(bindObj))
			// .call(
			// 	d3.drag()
			// 	.on('start', bindObj.dragBehavior.dragStarted)
			// 	.on('drag', bindObj.dragBehavior.dragged)
			// 	.on('end', bindObj.dragBehavior.dragEnded)
			// );

		nodeEnter.append('circle')
			.attr('class', 'nodeCircle')
			.attr('r', 10)
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
			.attr('r', 20)
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

		nodeUpdate
			.transition()
			.duration(bindObj.duration)
			.attr(
				'transform',
				(d) => `translate(${d.y},${d.x})`
			);

		nodeUpdate.select('circle.nodeCircle')
			.attr('r',
				(d) => d._children ? d._children.length * 4 : 6
			)
			.style(
				'fill', 
				(d) => d._children ? 'lightsteelblue' : '#fff'
			);

		nodeUpdate
			.select('text')
			.transition()
			.attr('x', 
				(d) => 
					d.children ? -10 :
					d._children ? (-10 - (d._children.length * 2)) : 
					10
			)
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

		nodeExit
			.select('circle')
			.attr('r', 0);

		nodeExit
			.select('text')
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
	}

}
