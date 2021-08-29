import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import {
	updateUser,
	deleteUser,
	clearErrors,
} from '../../actions/session_actions';
import { closeModal } from '../../actions/modal_actions';

/******************************
 *         CONSTANTS          *
 ******************************/

const ERRORS = [
	'', // 0 Blank email
	'', // 1 Email !valid
	'', // 2 Email taken
	"First name can't be blank", // 3 First name blank
	"Last name can't be blank", // 4 Last name blank
	'Password is too short (minimum is 6 characters)', // 5 PW too short
	'Passwords do not match', // 6 PW !match
];

/******************************
 *   Profile Component   *
 ******************************/

const Profile = ({
	currentUser,
	clearErrors,
	processForm,
	closeModal,
	deleteUser,
	formType,
}) => {
	const [user, setUser] = useState({
		password: '',
		firstName: '',
		lastName: '',
		passwordMatch: '',
	});
	const [errors, setErrors] = useState([]);
	const [deletingUser, setDeletingUser] = useState(false);
	const [success, setSuccess] = useState(false);
	const [demoMessage, setDemoMessage] = useState(false);

	useEffect(() => {
		setUser({
			...user,
			firstName: currentUser.first_name,
			lastName: currentUser.last_name,
		});
	}, []);

	const isBlank = (word) => word.trim().length < 1;
	const isPasswordMatch = () => user.password === user.passwordMatch;

	/***********************************
	 *           handleErrors          *
	 ***********************************/

	const handleErrors = () => {
		const { password, firstName, lastName } = user;
		clearErrors();

		let errs = [];

		if (isBlank(firstName) || isBlank(lastName)) {
			if (isBlank(firstName)) errs.push(ERRORS[3]); // 3 First name blank
			if (isBlank(lastName)) errs.push(ERRORS[4]); // 4 Last name blank
		}

		if (!isBlank(password) || !isPasswordMatch()) {
			if (password.length < 6) errs.push(ERRORS[5]); // 5 PW too short
			if (!isPasswordMatch() && !errs.includes(ERRORS[5])) errs.push(ERRORS[6]); // 6 PW !match
		}

		return errs;
	};

	/***********************************
	 *           handleSubmit          *
	 ***********************************/

	const handleSubmit = (e) => {
		e.preventDefault();
		if (currentUser.first_name === 'Demo' && currentUser.last_name === 'User') {
			setDemoMessage(true);
			return renderDemoMessage();
		}

		const errs = handleErrors();
		if (errs.length > 0) return setErrors(errs);

		const capitalizeFirstLetter = (string) =>
			string.charAt(0).toUpperCase() + string.toLocaleLowerCase().slice(1);

		let userUpdate = {
			first_name: capitalizeFirstLetter(user.firstName),
			last_name: capitalizeFirstLetter(user.lastName),
			id: currentUser.id,
		};

		if (errors.length < 1) {
			if (!isBlank(user.password) && isPasswordMatch()) {
				userUpdate.password = user.password;
				return processUpdate(userUpdate);
			} else {
				return processUpdate(userUpdate);
			}
		}
	};

	/***********************************
	 *          processUpdate          *
	 ***********************************/

	const processUpdate = (userUpdate) => {
		processForm(userUpdate);
		setSuccess(true);
		renderSuccessMessage();
	};

	/***********************************
	 *       renderSuccessMessage      *
	 ***********************************/

	const renderSuccessMessage = () => {
		window.setTimeout(() => {
			setSuccess(false);
			closeModal();
		}, 2500);
	};

	/***********************************
	 *       renderDemoMessage      *
	 ***********************************/

	const renderDemoMessage = () => {
		window.setTimeout(() => {
			setDemoMessage(false);
			closeModal();
		}, 4000);
	};

	/***********************************
	 *           handleChange          *
	 ***********************************/

	const handleChange = (e) => {
		const field = e.target.name;
		const value = e.target.value;
		setUser({ ...user, [field]: value });
	};

	/***********************************
	 *           renderErrors          *
	 ***********************************/

	const renderErrors = () => {
		const { password, firstName, lastName, passwordMatch } = user;

		const errsHash = {
			firstName: '',
			lastName: '',
			pwShort: '',
			pwNoMatch: '',
		};
		if (errors.length < 1) return errsHash;

		errors.forEach((err) => {
			if (ERRORS.indexOf(err) === 3) errsHash.firstName = err;
			if (ERRORS.indexOf(err) === 4) errsHash.lastName = err;
			if (ERRORS.indexOf(err) === 5) errsHash.pwShort = err;
			if (ERRORS.indexOf(err) === 6) errsHash.pwNoMatch = err;
		});

		if (!isBlank(firstName)) errsHash.firstName = '';
		if (!isBlank(lastName)) errsHash.lastName = '';
		if (password.length > 5) errsHash.pwShort = '';
		if (password === passwordMatch) errsHash.pwNoMatch = '';

		return errsHash;
	};

	/***********************************
	 *           handleDelete          *
	 ***********************************/

	const handleDelete = (currentUser) => {
		if (currentUser.first_name !== 'Demo' && currentUser.last_name !== 'User') {
			return deleteUser(currentUser.id);
		} else {
			setDemoMessage(true);
			return renderDemoMessage();
		}
	};

	/***********************************
	 *          !currentUser           *
	 ***********************************/

	if (!currentUser) return <div></div>;

	/***********************************
	 *             success             *
	 ***********************************/

	if (success) {
		return (
			<div className='success-message-div-update'>
				<span>Profile Updated!</span>
			</div>
		);

		/***********************************
		 *            demoMessage          *
		 ***********************************/
	} else if (demoMessage) {
		return (
			<div className='success-message-div-demo'>
				<span>Sorry, but you cannot modify the Demo.</span>
			</div>
		);

		/***********************************
		 *          !deletingUser          *
		 ***********************************/
	} else if (!deletingUser) {
		return (
			<div className='form-container-update'>
				<div className='form-title-update'>
					Update {currentUser.first_name}'s Profile
				</div>

				<div className='form-closing-x' onClick={closeModal}>
					&#10005;
				</div>

				<form onSubmit={(e) => handleSubmit(e)} className='form__update'>
					<div className='update-form'>
						<input
							type='text'
							className='update-form-input'
							value={user.firstName}
							placeholder={'First name'}
							onChange={handleChange}
							name='firstName'
							// noValidate
							// required
						/>
						<div className='form-errors-update-first'>
							{renderErrors().firstName}
							<i id='first-update' className='fas fa-user fa-lg'></i>
						</div>

						<input
							type='text'
							className='update-form-input'
							value={user.lastName}
							placeholder={'Last name'}
							onChange={handleChange}
							name='lastName'
							// noValidate
							// required
						/>
						<div className='form-errors-update-last'>
							{renderErrors().lastName}
							<i id='last-update' className='fas fa-user fa-lg'></i>
						</div>

						<input
							type='password'
							className='update-form-input'
							value={user.password}
							placeholder={'Create a password'}
							onChange={handleChange}
							name='password'
							// noValidate
							// required
						/>
						<div className='form-errors-update-password'>
							{renderErrors().pwShort}
							<i id='password-update' className='fas fa-lock fa-lg'></i>
						</div>

						<input
							type='password'
							className='update-form-input'
							value={user.passwordMatch}
							placeholder={'Confirm Password'}
							onChange={handleChange}
							name='passwordMatch'
							// noValidate
							// required
						/>
						<div className='form-errors-update-password'>
							{renderErrors().pwNoMatch}
						</div>
						<div className='update-form-button-container'>
							<button
								className='update-form-button'
								type='submit'
								value={formType}
							>
								Update
							</button>
							<button
								className='update-form-delete-btn'
								onClick={() => setDeletingUser(!deletingUser)}
							>
								Delete
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	} else {
		/***********************************
		 *           deletingUser          *
		 ***********************************/

		return (
			<Fragment>
				<div className='form-container-update'>
					<div className='form__update'>
						<div className='update-form'>
							<div className='update-form-button-container'>
								<button
									className='update-form-delete-btn'
									onClick={() => handleDelete(currentUser)}
								>
									Delete
								</button>
								<button
									className='update-form-cancel-btn'
									onClick={() => setDeletingUser(!deletingUser)}
								>
									Cancel
								</button>
							</div>

							<div className='update-form-delete-message'>
								<p>ARE YOU SURE YOU WANT TO DELETE YOUR ACCOUNT? </p>
								<br />
								<span>You will lose all your data permanently! </span>
								<br />
								<span>Please press the delete button to confirm. </span>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
};

const mapState = ({ errors, users, session }) => {
	return {
		currentUser: users[session.id],
		errors: errors ? errors : [],
		formType: 'Profile Update',
	};
};

const mapDispatch = (dispatch) => ({
	processForm: (user) => dispatch(updateUser(user)),
	deleteUser: (userId) => dispatch(deleteUser(userId)),
	closeModal: () => dispatch(closeModal()),
	clearErrors: () => dispatch(clearErrors()),
});

export default connect(mapState, mapDispatch)(Profile);
