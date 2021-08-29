import React, { useState, useEffect, Fragment } from 'react';
import SideNavbar from './SideNavbar';
import TopNavbar from './TopNavbar';
import NotesForm from '../forms/Notes';
import { connect } from 'react-redux';
import { clearDevoState } from '../../actions/devo_actions';
import { clearErrors } from '../../actions/session_actions';
import { clearNoteState } from '../../actions/note_actions';
import MainBody from './MainBody';

/******************************
 *     HomePage Component     *
 ******************************/

const HomePage = ({
	currentUser,
	clearErrors,
	clearDevoState,
	clearNoteState,
}) => {
	const [leftOpen, setLeftOpen] = useState(true);
	const [rightOpen, setRightOpen] = useState(true);
	const currentUserId = JSON.stringify(currentUser.id);
	const leftSide = leftOpen ? 'open' : 'closed';
	const rightSide = rightOpen ? 'open' : 'closed';

	useEffect(() => {
		clearErrors();
		return () => {
			clearDevoState();
			clearNoteState();
			localStorage.removeItem(currentUserId);
		};
	}, []);

	const leftSideRender = () => {
		return (
			<div className={`sidebar ${leftSide}`}>
				<div className='left-header'>
					<h3 className='title'>
						<span>Current Plan</span>
					</h3>
				</div>
				<div className='left-content'>
					{/* ---------- SIDE NAV START ---------- */}
					<SideNavbar />
					{/* ---------- SIDE NAV END  ---------- */}
				</div>
			</div>
		);
	};

	const rightSideRender = () => {
		return (
			<div className={`sidebar ${rightSide}`}>
				<div className='right-header'>
					<h3 className='title'>
						<span>My Notes</span>
					</h3>
				</div>
				<div className='content'>
					<NotesForm />
				</div>
			</div>
		);
	};

	/******************************
	 *           render           *
	 ******************************/

	return (
		<Fragment>
			<TopNavbar />
			<div id='layout'>
				<div id='left' className={leftSide}>
					<div className='icon' onClick={() => setLeftOpen(!leftOpen)}>
						<i className='fa fa-bars' aria-hidden='true'></i>
					</div>
					{leftSideRender()}
				</div>

				<div id='main'>
					<div className='main-header'>
						<h3
							className={`
                        title
                        ${'left-' + leftSide}
                        ${'right-' + rightSide}
                    `}
						>
							<span>Welcome {currentUser.first_name}!</span>
						</h3>
					</div>
					<div className='content'>
						<MainBody />
					</div>
				</div>
				<div id='right' className={rightSide}>
					<div className='icon' onClick={() => setRightOpen(!rightOpen)}>
						<i className='fa fa-bars' aria-hidden='true'></i>
					</div>
					{rightSideRender()}
				</div>
			</div>
		</Fragment>
	);
};

const mapState = ({ session, users }) => {
	return {
		currentUser: users[session.id],
	};
};

const mapDispatch = (dispatch) => ({
	clearErrors: () => dispatch(clearErrors()),
	clearDevoState: () => dispatch(clearDevoState()),
	clearNoteState: () => dispatch(clearNoteState()),
});

export default connect(mapState, mapDispatch)(HomePage);
