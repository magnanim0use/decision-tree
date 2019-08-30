import { combineReducers } from 'redux';
import tree from './tree';
import node from './node';
import modal from './modal';

export default combineReducers(
	{ 
		tree, 
		node, 
		modal 
	}
);
