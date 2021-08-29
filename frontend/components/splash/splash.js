import React from 'react';
import LoginForm from '../forms/Login';
import { connect } from 'react-redux';
import { login } from '../../actions/session_actions';

/******************************
 *      Splash Component      *
 ******************************/

const Splash = () => (
	<div className='splash-main'>
		<LoginForm />
	</div>
);

const mapState = ({ session, users }) => ({
	currentUser: users[session.id],
});

const mapDispatch = (dispatch) => ({
	login: (user) => dispatch(login(user)),
});

export default connect(mapState, mapDispatch)(Splash);
