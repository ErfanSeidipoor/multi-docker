import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import OthePage from "./OthePage";
import Fib from "./Fib";
import './App.css';

function App() {
	return (
		<Router>
			<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<Link to="/">Home</Link>
				<Link to="/otherpage">otherPage</Link>
			</header>
			<div>
				<Route exact path='/' component={Fib} />
				<Route path='/otherpage' component={OthePage} />

			</div>
			</div>
		</Router>
	);
}

export default App;
