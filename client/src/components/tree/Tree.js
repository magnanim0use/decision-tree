import React from 'react';
import { connect } from 'react-redux';
import Tooltip from '../tooltip/Tooltip';
import './Tree.css';
import {
	moveNode
} from '../../redux/actions';

import TreeGraph from './render';

let treeGraph;

function Tree() {	
	return (
	  <div className='Tree'>
	  	<div id='decision-tree-container'>
	  		<Tooltip />
	  	</div>
	  </div>	
	);
}

const mapDispatchToProps = (dispatch) => {
	setTimeout (() => {
		treeGraph = new TreeGraph({ dispatch });
		treeGraph.render({ data: {} });
	}, 300);

	return {
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
