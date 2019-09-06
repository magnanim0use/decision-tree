import React from 'react';
import { connect } from 'react-redux';
import './Tree.css';

import {
	hasTreeChanged
} from '../../helpers';

import {
	INIT_CREATE_NODE
} from '../../redux/actions';

import TreeGraph from './render';

let treeGraph;

function Tree() {	
	return (
	  <div className="Tree">
	  	<div id="decision-tree-container" />
	  </div>	
	);
}

const initCreateNode = (parentId) => ({
	type: 'INIT_CREATE_NODE',
	payload: {
		parentId
	}
});

const moveNode = (nodeId, oldParentId, newParentId) => ({
	type: 'MOVE_NODE',
	payload: {
		nodeId,
		oldParentId,
		newParentId
	}
});

const mapDispatchToProps = (dispatch) => {
	setTimeout (() => {
		treeGraph = new TreeGraph({ dispatch });
		treeGraph.render({ data: {} });
	}, 300);

	return {
		initCreateNode: (...args) => dispatch(initCreateNode(...args)),
		moveNode: (...args) => dispatch(moveNode(...args))
	}
}

const mapStateToProps = state => {
	const {
		tree
	} = state;

	console.log(state)

	setTimeout(() => {
		// if (!hasTreeChanged) {
		// 	return state;
		// }
		// if (['PENDING', 'CREATE', 'UPDATE'].indexOf(node.action) !== -1) {
		// 	treeGraph.render(node);
		// } else {
			treeGraph.render(tree);
		// }

		return state;
	}, 500);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Tree);
