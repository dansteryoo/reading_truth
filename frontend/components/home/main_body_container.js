import { connect } from 'react-redux';
import { closeModal, openModal } from '../../actions/modal_actions';
import { fetchDevo } from '../../actions/devo_actions';
import { clearErrors } from '../../actions/session_actions';
import { createBookmark, fetchBookmark, deleteBookmark } from '../../actions/bookmark_actions';
import MainBody from './main_body';
import { sortDevoBook } from '../../helpers/helperFunctions';

const mapStateToProps = ({ session, users, devos, bookmark, errors }) => {
	const devoBook = devos.devoBook ? Object.values(devos.devoBook) : [];

	return {
		currentUser: users[session.id],
		mainBodyDevo: devos.mainBodyDevo ?? null,
		errors,
		devoBook: sortDevoBook(devoBook),
		bookmark,
	};
};

const mapDispatchToProps = (dispatch) => ({
	closeModal: () => dispatch(closeModal()),
	openModal: (formType) => dispatch(openModal(formType)),
	clearErrors: () => dispatch(clearErrors()),
	fetchDevo: (devoId) => dispatch(fetchDevo(devoId)),
	createBookmark: (bookmark) => dispatch(createBookmark(bookmark)),
	fetchBookmark: () => dispatch(fetchBookmark()),
	deleteBookmark: (bookmarkId) => dispatch(deleteBookmark(bookmarkId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainBody);
