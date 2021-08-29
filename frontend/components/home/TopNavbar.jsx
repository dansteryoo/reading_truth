import React, { useState, useEffect } from 'react';
import { searchRegexMatch } from '../../helpers/helperFunctions';
import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';
import { closeModal, openModal } from '../../actions/modal_actions';

/******************************
 *      TopNavbar Component      *
 ******************************/

const TopNavbar = ({ openModal, closeModal, logout }) => {
	const [search, setSearch] = useState('');

	useEffect(() => {
		return () => closeModal();
	}, []);

	/******************************
	 *        handleSubmit        *
	 ******************************/

	const handleSubmit = (e) => {
		e.preventDefault();
		openModal('Categories', searchRegexMatch(search.toLowerCase()));
	};

	/******************************
	 *       checkPosition        *
	 ******************************/

	const checkPosition = () => {
		if (window.matchMedia('(max-width: 1200px)').matches) {
			return 'navsearch-none';
		} else {
			return 'navsearch';
		}
	};

	/******************************
	 *           render           *
	 ******************************/

	return (
		<nav className='nav-container'>
			<div className='nav-home'>
				<img src={window.logo} />
			</div>

			<div className={checkPosition()}>
				<img className='navsearch-icon' src={window.search_icon} height='20' />
				<form onSubmit={handleSubmit} className='navbar-search-form'>
					<input
						className='navsearch-input'
						type='text'
						placeholder='Search..'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</form>
			</div>

			<ul className='nav-links'>
				<li className='devo-li' onClick={() => openModal('Categories')}>
					Devotionals
				</li>
				<li className='notes-li' onClick={() => openModal('Notes')}>
					Notes
				</li>
				<li className='profile-li'>
					<a onClick={() => openModal('Profiles')}>Profile</a>
					<ul className='dropdown-profile'>
						<li className='logout-li' onClick={() => logout()}>
							Logout
						</li>
					</ul>
				</li>
			</ul>
		</nav>
	);
};

const mapState = ({ session, users }) => {
	return {
		currentUser: users[session.id],
	};
};

const mapDispatch = (dispatch) => ({
	logout: () => dispatch(logout()),
	closeModal: () => dispatch(closeModal()),
	openModal: (modal, book) => dispatch(openModal(modal, book)),
});

export default connect(mapState, mapDispatch)(TopNavbar);
