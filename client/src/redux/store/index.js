import { 
	createStore, 
	applyMiddleware 
} from 'redux';

import rootReducer from '../reducers';
import loggerMiddleware from '../middleware/logger';
import treeMiddleware from '../middleware/tree';

import {
	getState,
	saveState
} from './local-storage';

const existingState = getState();

const store = createStore(
	rootReducer,
	existingState,
	applyMiddleware(
		loggerMiddleware,
		treeMiddleware
	)
);

store.subscribe(
	() => saveState(store.getState())
);

export default store;
