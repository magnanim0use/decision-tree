import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import { 
	loggerMiddleware, 
	// apiMiddleware 
} from '../middleware';

export default createStore(
	rootReducer,
	applyMiddleware(
		// apiMiddleware,
		loggerMiddleware
	)
);
