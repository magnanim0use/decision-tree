import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import DecisionTree from './DecisionTree';

ReactDOM.render(
	<Provider store={store}>
		<DecisionTree />
	</Provider>, 
	document.getElementById('root')
);
