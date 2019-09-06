import React from 'react';
import { connect } from 'react-redux';
import './Tree.css';

import {
	INIT_CREATE_NODE,
	MOVE_NODE
} from '../../redux/actions/constants';

import {
	initCreateNode,
	initEditNode,
	moveNode
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

const mapDispatchToProps = (dispatch) => {
	setTimeout (() => {
		treeGraph = new TreeGraph({ dispatch });
		treeGraph.render({ data: {} });
	}, 300);

	return {
		initCreateNode: (...args) => dispatch(initCreateNode(...args)),
		initEditNode: (...args) => dispatch(initEditNode(...args)),
		moveNode: (...args) => dispatch(moveNode(...args))
	}
}

const mapStateToProps = state => {
	const {
		tree
	} = state;

	if (!tree || !tree.shouldUpdate) {
		return;
	}

	setTimeout(() => {
		treeGraph.render(tree);
		return state;
	}, 500);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Tree);
