import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup, clearErrors } from '../../actions/session_actions';
import {
	wordIsBlank,
	capitalizeFirstLetter,
} from '../../helpers/helperFunctions';
const ERRORS = [
	"Email can't be blank", // 0 Blank email
	'Email is invalid', // 1 Email !valid
	'Email has already been taken', // 2 Email taken
	"First name can't be blank", // 3 First name blank
	"Last name can't be blank", // 4 Last name blank
	'Password is too short (minimum is 6 characters)', // 5 PW too short
	'Passwords do not match', // 6 PW !match
];

/******************************
 *    Signup Component    *
 ******************************/

const Signup = ({
	clearErrors,
	processForm,
	errors,
	formType,
	history,
}) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [passwordMatch, setPasswordMatch] = useState('');
	const [formErrors, setFormErrors] = useState('');

	useEffect(() => {
		return () => clearErrors();
	}, []);

	/******************************
	 *     isPasswordMatched      *
	 ******************************/

	const isPasswordMatched = () => {
		return password === passwordMatch;
	};

	/******************************
	 *       checkFormErrors      *
	 ******************************/

	const checkFormErrors = () => {
		let errs = [];
		if (
			wordIsBlank(email) ||
			wordIsBlank(firstName) ||
			wordIsBlank(lastName) ||
			wordIsBlank(password) ||
			!isPasswordMatched()
		) {
			if (wordIsBlank(email)) errs.push(ERRORS[0]); // 0 Blank email
			if (wordIsBlank(firstName)) errs.push(ERRORS[3]); // 3 First name blank
			if (wordIsBlank(lastName)) errs.push(ERRORS[4]); // 4 Last name blank
			if (password.length < 6) errs.push(ERRORS[5]); // 5 PW too short
			if (!isPasswordMatched() && !errs.includes(ERRORS[5]))
				errs.push(ERRORS[6]); // 6 PW !match
		}
		return errs;
	};

	/******************************
	 *        handleSubmit        *
	 ******************************/

	const handleSubmit = (e) => {
		e.preventDefault();
		clearErrors();
		const errs = checkFormErrors();
		if (errs.length > 0) return setFormErrors(errs);

		const user = {
			email: email.toLowerCase(),
			password: password,
			first_name: capitalizeFirstLetter(firstName),
			last_name: capitalizeFirstLetter(lastName),
		};

		if (formErrors.length < 2) {
			processForm(user).then(() => history.push('/welcome'));
		}
	};

	/******************************
	 *        renderErrors        *
	 ******************************/

	const renderErrors = () => {
		const errorsHash = {
			emailBlank: '',
			emailInvalid: '',
			emailTaken: '',
			firstName: '',
			lastName: '',
			pwShort: '',
			pwNoMatch: '',
		};

		if (errors.length < 1 && formErrors.length < 1) return errorsHash;

		formErrors.forEach((err) => {
			if (ERRORS.indexOf(err) === 0) errorsHash.emailBlank = err;
			if (ERRORS.indexOf(err) === 3) errorsHash.firstName = err;
			if (ERRORS.indexOf(err) === 4) errorsHash.lastName = err;
			if (ERRORS.indexOf(err) === 5) errorsHash.pwShort = err;
			if (ERRORS.indexOf(err) === 6) errorsHash.pwNoMatch = err;
		});

		errors.forEach((err) => {
			if (ERRORS.indexOf(err) === 1) errorsHash.emailInvalid = err;
			if (ERRORS.indexOf(err) === 2) errorsHash.emailTaken = err;
			if (ERRORS.indexOf(err) === 5) errorsHash.pwShort = err;
		});

		if (!wordIsBlank(email)) errorsHash.emailBlank = '';
		if (!wordIsBlank(firstName)) errorsHash.firstName = '';
		if (!wordIsBlank(lastName)) errorsHash.lastName = '';
		if (password.length > 5) errorsHash.pwShort = '';
		if (password === passwordMatch) errorsHash.pwNoMatch = '';

		return errorsHash;
	};

	/******************************
	 *           render           *
	 ******************************/

	return (
		<div className='form-container-signup'>
			<div className='form-title-signup'>
				<span id='signup-title'>Sign up with email or </span>
				<Link to='/'>
					<span id='signup-to-login'> Login</span>
				</Link>
			</div>
			<form onSubmit={handleSubmit} className='form'>
				<div className='signup-form'>
					<input
						type='email'
						className='signup-form-input'
						value={email}
						placeholder={'Email address'}
						onChange={(e) => setEmail(e.target.value)}
						name='email'
						// noValidate
						// required
					/>
					<div className='form-errors-signup-email'>
						{renderErrors().emailBlank}
						{renderErrors().emailInvalid}
						{renderErrors().emailTaken}
						<i id='email' className='fas fa-envelope fa-lg'></i>
					</div>

					<input
						type='text'
						className='signup-form-input'
						value={firstName}
						placeholder={'First name'}
						onChange={(e) => setFirstName(e.target.value)}
						name='firstName'
						// noValidate
						// required
					/>
					<div className='form-errors-signup-first'>
						{renderErrors().firstName}
						<i id='first' className='fas fa-user fa-lg'></i>
					</div>

					<input
						type='text'
						className='signup-form-input'
						value={lastName}
						placeholder={'Last name'}
						onChange={(e) => setLastName(e.target.value)}
						name='lastName'
						// noValidate
						// required
					/>
					<div className='form-errors-signup-last'>
						{renderErrors().lastName}
						<i id='last' className='fas fa-user fa-lg'></i>
					</div>

					<input
						type='password'
						className='signup-form-input'
						value={password}
						placeholder={'Create a password'}
						onChange={(e) => setPassword(e.target.value)}
						name='password'
						// noValidate
						// required
					/>
					<div className='form-errors-signup-password'>
						{renderErrors().pwShort}
						<i id='password' className='fas fa-lock fa-lg'></i>
					</div>

					<input
						type='password'
						className='signup-form-input'
						value={passwordMatch}
						placeholder={'Confirm Password'}
						onChange={(e) => setPasswordMatch(e.target.value)}
						name='passwordMatch'
						// noValidate
						// required
					/>
					<div className='form-errors-signup-password'>
						{renderErrors().pwNoMatch}
					</div>
					<button className='signup-form-button' type='submit' value={formType}>
						Sign Up
					</button>
				</div>
			</form>
		</div>
	);
};

const mapState = (state) => {
	let errors = state.errors ? state.errors : [];
	return {
		formType: 'Sign Up',
		errors: errors,
	};
};

const mapDispatch = (dispatch) => ({
	processForm: (user) => dispatch(signup(user)),
	clearErrors: () => dispatch(clearErrors()),
});

export default connect(mapState, mapDispatch)(Signup);
