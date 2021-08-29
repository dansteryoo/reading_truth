import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modal_actions';
import Categories from '../modals/Categories';
import NotesContainer from '../modals/NotesContainer';
import ProfilePage from '../modals/Profile';

/******************************
 *       Modal Component      *
 ******************************/

const Modal = ({ modal, closeModal }) => {
	if (!modal) return null;

	let component;
	switch (modal) {
		case 'Notes':
			component = <NotesContainer />;
			break;
		case 'Categories':
			component = <Categories />;
			break;
		case 'Profiles':
			component = <ProfilePage />;
			break;
		default:
			return null;
	}

	return (
		<div className='modal-background' onClick={closeModal}>
			<div className='modal-content' onClick={(e) => e.stopPropagation()}>
				{component}
			</div>
		</div>
	);
};

const mapState = (state) => {
	let modalVar;
	if (!state.modal) {
		modalVar = null;
	} else {
		modalVar = state.modal.formType;
	}
	let idVar;
	if (!state.modal) {
		idVar = null;
	} else {
		idVar = state.modal.bookingId;
	}

	return {
		modal: modalVar,
		typeId: idVar,
	};
};

const mapDispatch = (dispatch) => ({
	closeModal: () => dispatch(closeModal()),
});

export default connect(mapState, mapDispatch)(Modal);
