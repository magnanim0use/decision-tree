import * as d3 from 'd3'

import {
	SHOW_NODE_OPTIONS,
	INIT_MOVE_NODE,
	MOVE_NODE
} from '../../redux/actions/constants';

import {
	getChildCount
} from '../../helpers';

export default class TreeGraph {

	constructor ({ dispatch }) {
		const bindObj = this;
		this.selectedNode = null;
		this.draggingNode = null;

		this.dispatch = dispatch;

		this.panSpeed = 200;
		this.panBoundary = 20;

		this.i = 0;
		this.duration = 750;

		this.viewerWidth = document.body.clientWidth * 2;
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

		this.g = d3.select('#decision-tree-container svg')
			.append('g')
			.attr('transform', 'translate(80,0)');

		this.dragBehavior = this.dragListener();
	}

	render (treeData) {
		const {
			data,
			activeNode
		} = treeData;

		this.treeData = data;

		// if (activeNode) {
		// 	let nodeToUpdate;
		// 	switch (activeNode.activeState) {
		// 		case 'CREATE':
		// 			const newTree = d3.hierarchy(data);
		// 			return this.update(newTree);

		// 		case 'EDIT':
		// 			nodeToUpdate = findNodeById(this.root, activeNode.id);
		// 			return this.update(nodeToUpdate);
		// 	}
		// }

		this.root = d3.hierarchy(this.treeData);
		this.root.x0 = this.viewerHeight / 2; //work with this
		this.root.y0 = 100; //should be dynamic
		this.update(this.root);
	}

	dragListener () {
		const bindObj = this;

		function dragStarted (node) {
			if (node === bindObj.root) {
				return;
			}

			bindObj.dragStarted = true;

			bindObj.dispatchActions({
				type: INIT_MOVE_NODE,
				payload: {
					id: node.data.id
				}
			});
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

				d3.select(this)
					// .attr('cx', (d) => node.x = d3.event.x)
					// .attr('cy', (d) => node.y = d3.event.y)
					.attr('cx', (d) => node.y0 = d3.event.x)
					.attr('cy', (d) => node.x0 = d3.event.y)
					.attr(
						'transform', 
						(d) => `translate(${d.y0 - 115},${d.x0 + 120})`
					);
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

		function overCircle (node) {
			bindObj.selectedNode = node;
			d3.select(this)
				.style('fill', 'blue');
		}

		function outCircle (node) {
			bindObj.selectedNode = null;
			d3.select(this)
				.style('fill', 'red');
		}

		return {
			dragStarted,
			dragged,
			dragEnded,
			overCircle,
			outCircle
		};
	}

	dispatchActions (action) {
		this.dispatch(action);
	}

	showNodeOptions (node) {
		this.dispatchActions({
			type: SHOW_NODE_OPTIONS,
			payload: {
				id: node.data.id,
				parentId: node.parent ? node.parent.data.id : null,
				position: {
					x: node.x,
					y: node.y
				},
				_children: node.data._children,
				children: node.data.children 
			}
		});
	}

	moveNode(node, newParentNode) {
		this.dispatchActions({
			type: MOVE_NODE,
			payload: {
				id: node.data.id,
				parentId: node.parent.data.id,
				newParentId: newParentNode.data.id
			}
		});
	}

	overCircle (node) {
		this.selectedNode = node;
	}

	outCircle () {
		this.selectedNode = null;
	}

	click (node) {
		if (d3.event.defaultPrevented) {
			return;
		}

		this.dragStarted = false;
		this.showNodeOptions(node);
		// this.toggle(node);
	}

	dblClick (node) {
		this.initCreateNode(node);
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
			// .on('dblclick', bindObj.dblClick.bind(bindObj))
			// .on('mouseup', bindObj.mouseUp.bind(bindObj))
			// .on('mousedown', bindObj.mouseDown.bind(bindObj))
			.call(
				d3.drag()
				.on('start', bindObj.dragBehavior.dragStarted)
				.on('drag', bindObj.dragBehavior.dragged)
				.on('end', bindObj.dragBehavior.dragEnded)
			);

		nodeEnter.append('circle')
			.attr('r', 0)
			.transition()
			.attr('r', (d) => {
					const childCount = getChildCount(d.data);
					return childCount ? childCount * 4 : 6
			})
			.attr('class', 'nodeCircle')
			.style(
				'fill',
				(d) => d.data.status === 'COMPLETE' ? '#3CB371' :
					d.data._children ? 'lightsteelblue' : 
					'#fff'
			);

		nodeEnter.append('text')
			.attr('x', (d) => d.children || d.data._children ? -10 : 10)
			.attr('dy', '.35em')
			.attr('font-size', '150%')
			.attr('class', 'nodeText')
			.attr('text-anchor', (d) => d.children || d.data._children ? 'end' : 'start')
			.text((d) => d.data.name)
			.style('fill-opacity', 0);

		nodeEnter.append('circle')
			.attr('class', 'ghostCircle')
			.attr('r', 20)
			.attr('opacity', 0.2)
			.style('fill', 'red')
			.attr('pointer-events', 'mouseover')
			.on('mouseover', bindObj.dragBehavior.overCircle)
			.on('mouseout', bindObj.dragBehavior.outCircle);

		const nodeUpdate = nodeEnter.merge(node);

		nodeUpdate
			.transition()
			.duration(bindObj.duration)
			.attr(
				'transform',
				(d) => `translate(${d.y},${d.x})`
			);

		nodeUpdate.select('circle.nodeCircle')
			.attr('r', (d) => {
					const childCount = getChildCount(d.data);
					return childCount ? childCount * 4 : 6
			})
			.style(
				'fill',
				(d) => d.data.status === 'COMPLETE' ? '#3CB371' :
					d.data._children ? 'lightsteelblue' : 
					'#fff'
			);

		nodeUpdate
			.select('text')
			.transition()
			.attr('x', 
				(d) => 
					d.children ? -10 :
					d.data._children ? (-10 - (d.data._children.length * 2)) : 
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
    		.data(
    			bindObj.root.links(), 
    			(d) => d.target.id
    		);

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
