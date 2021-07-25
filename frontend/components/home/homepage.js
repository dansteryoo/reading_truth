import React, { useState, useEffect, Fragment } from 'react';
import SideNav from '../sidenav/sidenav';
import Navbar from '../navbar/navbar';
import NotesForm from '../notes/notesForm';
import { connect } from 'react-redux';
import { clearDevoState } from '../../actions/devo_actions';
import { clearErrors } from '../../actions/session_actions';
import { clearNoteState } from '../../actions/note_actions';
import MainBodyContainer from './main_body_container';

/******************************
 *     Homepage Component     *
 ******************************/

const Homepage = ({ currentUser, clearErrors, clearDevoState, clearNoteState }) => {
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
					<SideNav />
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
					{/* ---------- NOTE FORM START ---------- */}
					<NotesForm />
					{/* ---------- NOTE FORM END ---------- */}
				</div>
			</div>
		);
	};

	/******************************
	 *           render           *
	 ******************************/

	return (
		<Fragment>
			{/* ---------- TOP NAV START ---------- */}
			<Navbar />
			{/* ---------- TOP NAV END  ---------- */}
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
						{/* ---------- MAIN BODY START ---------- */}
						<MainBodyContainer />
						{/* ---------- MAIN BODY END ---------- */}
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

/******************************
 *       mapStateToProps      *
 ******************************/

const mapStateToProps = ({ session, users }) => {
	return {
		currentUser: users[session.id],
	};
};

/******************************
 *     mapDispatchToProps     *
 ******************************/

const mapDispatchToProps = (dispatch) => ({
	clearErrors: () => dispatch(clearErrors()),
	clearDevoState: () => dispatch(clearDevoState()),
	clearNoteState: () => dispatch(clearNoteState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
