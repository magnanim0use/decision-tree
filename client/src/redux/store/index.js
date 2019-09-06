import { 
	createStore, 
	applyMiddleware 
} from 'redux';

import rootReducer from '../reducers';
import loggerMiddleware from '../middleware/logger';
import treeMiddleware from '../middleware/tree';

export default createStore(
	rootReducer,
	applyMiddleware(
		loggerMiddleware,
		treeMiddleware
	)
);
