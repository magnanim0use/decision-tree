import React from 'react';
import { connect } from 'react-redux';
import './Tree.css';

import {
	INIT_CREATE_NODE
} from '../../redux/actions';

import TreeGraph from './render';
const treeData = require('./data.json');

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

const mapDispatchToProps = (dispatch) => {
	setTimeout (() => {
		treeGraph = new TreeGraph({ dispatch });
		treeGraph.render(treeData);
	}, 300);

	return {
		initCreateNode: () => dispatch(initCreateNode())
	}
}

const mapStateToProps = state => {
	// const {
	// 	tree
	// } = state;

	// setTimeout(() => {
	// 	treeGraph.render(tree);
	// 	return state;
	// }, 500);
	return state;
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Tree);
