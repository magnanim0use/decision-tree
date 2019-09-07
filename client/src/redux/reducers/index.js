import { combineReducers } from 'redux';
import tree from './tree';
import modal from './modal';
import form from './form';

export default combineReducers(
	{ 
		modal,
		tree,
		form 
	}
);
