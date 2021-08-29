import React from 'react';
import { Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import Modal from './splash/Modal1';
import Splash from './splash/Splash1';
import SignupForm from './forms/Signup';
import HomePage from './home/HomePage1';
import WelcomeMessage from './home/WelcomeMessage';

const App = () => {
	return (
		<div className='app-class'>
			<Modal />

			<Switch>
				<AuthRoute exact path='/' component={Splash} />
				<AuthRoute exact path='/wrt/sign_up' component={SignupForm} />
			</Switch>

			<Switch>
				<ProtectedRoute exact path='/welcome' component={WelcomeMessage} />
				<ProtectedRoute exact path='/home' component={HomePage} />
			</Switch>
		</div>
	);
};

export default App;
