import React from 'react';
import { connect } from 'react-redux';
import TreeGraph from './render';
import './Tree.css';
const treeData = require('./data.json');

let treeGraph;

function Tree() {	
	return (
	  <div className="Tree">
	  	<div id="decision-tree-container" />
	  </div>	
	);
}

const mapDispatchToProps = dispatch => {
	setTimeout (() => {
		treeGraph = new TreeGraph();
		treeGraph.render(treeData);
	}, 500);
}

const mapStateToProps = state => {
	return {};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Tree);
