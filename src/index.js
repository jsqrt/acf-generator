import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { initialStore } from './constants/initialStore';
import { rootReducer } from './reducers';

const root = ReactDOM.createRoot(document.getElementById('root'));

const store = configureStore({
	reducer: rootReducer,
	preloadedState: initialStore,
});

root.render(
	// <React.StrictMode>
	<BrowserRouter>
		<Provider store={store}>
			<App />
		</Provider>
	</BrowserRouter>,
	// </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
