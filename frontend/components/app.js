import React from 'react';
import { Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import Modal from '../components/splash/Modal';
import Splash from '../components/splash/Splash';
import SignupForm from '../components/forms/Signup';
import HomePage from '../components/home/HomePage';
import WelcomeMessage from '../components/home/WelcomeMessage';

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
