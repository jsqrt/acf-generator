import React from 'react';
import { Homepage } from "./routes";
import { Routes, Route } from "react-router-dom";
import './scss/main_global.scss';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Homepage />} />
		</Routes>
	);
}

export default App;
