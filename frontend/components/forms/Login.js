import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login, logindemo, clearErrors } from '../../actions/session_actions';

/******************************
 *     Login Component    *
 ******************************/

const Login = ({
	clearErrors,
	processForm,
	logindemo,
	errors,
	formType,
}) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		return () => clearErrors();
	}, []);

	/******************************
	 *        handleSubmit        *
	 ******************************/

	const handleSubmit = (e) => {
		e.preventDefault();
		const user = {
			email,
			password,
		};
		user.email = user.email.toLowerCase();
		return processForm(user);
	};

	/******************************
	 *        renderErrors        *
	 ******************************/

	const renderErrors = () => {
		return (
			<ul className='form-errors-login'>
				{errors.map((error, i) => (
					<li key={`error-${i}`}>{error}</li>
				))}
			</ul>
		);
	};

	/******************************
	 *           render           *
	 ******************************/

	return (
		<div className='form-container'>
			<div className='form-title'>
				<span id='login-title'>Login to continue or </span>
				<Link to='/wrt/sign_up'>
					<span id='login-to-signup'> Signup</span>
				</Link>
			</div>
			<br />
			<form onSubmit={handleSubmit} className='form'>
				{renderErrors()}
				<div className='form'>
					<input
						type='text'
						className='form-input'
						value={email}
						placeholder={'Email address'}
						onChange={(e) => setEmail(e.target.value)}
						// required
					/>
					<i id='form-icon-login' className='fas fa-envelope fa-lg'></i>

					<input
						type='password'
						className='form-input'
						value={password}
						placeholder={'Password'}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete='on'
						// required
					/>
					<i id='form-icon-login' className='fas fa-lock fa-lg'></i>
					<button className='form-button' type='submit' value={formType}>
						Log In
					</button>
				</div>
			</form>
			<button
				className='form-demo-button'
				type='submit'
				onClick={() => logindemo()}
			>
				Demo User
			</button>
		</div>
	);
};

const mapState = (state) => {
	let errors = state.errors ? state.errors : [];
	return {
		formType: 'Log In',
		errors: errors,
	};
};

const mapDispatch = (dispatch) => ({
	logindemo: () => dispatch(logindemo()),
	processForm: (user) => dispatch(login(user)),
	clearErrors: () => dispatch(clearErrors()),
});

export default connect(mapState, mapDispatch)(Login);
