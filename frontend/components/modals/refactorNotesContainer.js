import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modal_actions';
import { fetchNote, fetchNotes, deleteNote } from '../../actions/note_actions';
import NotesItem from './NotesItem';
import Pagination from './Pagination';
import { searchRegexMatch } from '../../helpers/helperFunctions';

/******************************
 *         CONSTANTS          *
 ******************************/

const NOTES_PER_PAGE = 40;

/******************************
 *     NotesPage Component    *
 ******************************/

const NotesPage = ({
	fetchNotes,
	fetchNote,
	deleteNote,
	currentUser,
	closeModal,
}) => {
	const [noteId, setNoteId] = useState('');
	const [notes, setNotes] = useState([]);
	const [search, setSearch] = useState('');
	const [checked, setChecked] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		getNotes();
	}, []);

	/******************************
	 *       getNotes       *
	 ******************************/

	const getNotes = async () => {
		let { notes } = await fetchNotes();
		notes = Object.values(notes);
		setNotes(notes);
		setLoading(false);
	};

	/******************************
	 *         sortByType         *
	 ******************************/

	const sortByType = (notes, type) => {
		let sortedNotes = notes
			.sort((a, b) =>
				a[`${type}`].toLowerCase() < b[`${type}`].toLowerCase() ? -1 : 1
			)
			.map((ele) => ele);

		type === 'updated_at' ? sortedNotes.reverse() : sortedNotes;
		return sortedNotes;
	};

	/******************************
	 *        handleUpdate        *
	 ******************************/

	const handleUpdate = (noteId) => {
		fetchNote(noteId);
		return closeModal();
	};

	/******************************
	 *        handleDelete        *
	 ******************************/

	const handleDelete = (noteId) => {
		deleteNote(noteId).then(() => getNotes());
	};

	/******************************
	 *        toggleClass         *
	 ******************************/

	const toggleClass = (noteId) => {
		setNoteId(noteId);
	};

	/******************************
	 *        handleCheck         *
	 ******************************/

	const handleCheck = (e) => {
		const checkbox = e.target.value;

		let myCheckbox = document.getElementsByName('checkbox');
		let checkboxBool = [];

		myCheckbox.forEach((ele) => {
			if (checkbox !== ele.value) ele.checked = false;
			checkboxBool.push(ele.checked === true);
		});

		/******************************
		 *   default created_at sort  *
		 *   on blank checkboxes      *
		 ******************************/

		if (!checkboxBool.includes(true)) {
			setNotes(sortByType(notes, 'created_at'));
			setChecked(false);
		} else {
			setChecked(true);
			switch (checkbox) {
				case 'byBook':
					return setNotes(sortByType(notes, 'category'));
				case 'byUpdated':
					return setNotes(sortByType(notes, 'updated_at'));
			}
		}
	};

	/******************************
	 *        handleSearch        *
	 ******************************/

	const handleSearch = (e) => {
		const search = e.target.value;
		setSearch(search);

		const searchData = searchRegexMatch(search.toLowerCase());
		const sortNotes = notes.filter((each) => {
			let sortTitles = each.title.toLowerCase().match(searchData);
			let sortBody = each.body.toLowerCase().match(searchData);
			let sortBook = each.category.toLowerCase().match(searchData);

			return sortTitles || sortBody || sortBook;
		});

		let myCheckbox = document.getElementsByName('checkbox');
		let checkboxName = [];

		myCheckbox.forEach((ele) => {
			if (ele.checked) checkboxName.push(ele.value);
		});

		if (checked) {
			if (checkboxName.includes('byBook')) {
				return setNotes(sortByType(sortNotes, 'category'));
			} else {
				return setNotes(sortByType(sortNotes, 'updated_at'));
			}
		} else {
			return setNotes(sortByType(sortNotes, 'created_at'));
		}
	};

	/******************************
	 *       renderModalTop       *
	 ******************************/

	const renderModalTop = () => {
		const totalNotes = notes.length;
		const maxPage = Math.ceil(totalNotes / NOTES_PER_PAGE);
		const lastNote = Math.min(currentPage * NOTES_PER_PAGE, totalNotes);
		const firstNote = currentPage * NOTES_PER_PAGE - NOTES_PER_PAGE + 1;

		/******************************
		 *        change pages        *
		 ******************************/

		const paginate = (pageNumber) => setCurrentPage(pageNumber);
		const nextPage = () =>
			currentPage < maxPage && setCurrentPage(currentPage + 1);
		const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
		let currentUser_firstName = currentUser ? currentUser.first_name : 'Demo';

		return (
			<div className='notes-modal-top'>
				<div className='notes-page-username'>
					<span>{currentUser_firstName}'s Notes</span>
				</div>
				<div className='notes-search'>
					<form className='notes-bar-search-form'>
						<input
							className='notes-search-input'
							type='text'
							placeholder='Search..'
							value={search}
							onChange={handleSearch}
						/>
					</form>
				</div>
				<div className='checkbox-container'>
					<label className='container'>
						By Book
						<input
							type='checkbox'
							name='checkbox'
							value='byBook'
							onChange={(e) => handleCheck(e)}
						/>
						<span className='checkmark'></span>
					</label>
					<label className='container'>
						By Updated
						<input
							type='checkbox'
							name='checkbox'
							value='byUpdated'
							onChange={(e) => handleCheck(e)}
						/>
						<span className='checkmark'></span>
					</label>

					<Pagination
						paginate={paginate}
						currentPage={currentPage}
						nextPage={nextPage}
						prevPage={prevPage}
						maxPage={maxPage}
					/>
				</div>
				<div className='notes-modal-top-totalnum'>
					<span>
						{firstNote} to {lastNote} of {totalNotes}
					</span>
				</div>

				<div className='form-closing-x' onClick={() => closeModal()}>
					&#10005;
				</div>
				<div className='form-or-separator-notes'>
					<hr />
				</div>
			</div>
		);
	};
	/******************************
	 *      get current notes     *
	 ******************************/

	const idxOfLastNote = currentPage * NOTES_PER_PAGE;
	const idxOfFirstNote = idxOfLastNote - NOTES_PER_PAGE;
	const currentNotes = notes.slice(idxOfFirstNote, idxOfLastNote);

	/******************************
	 *           render           *
	 ******************************/

	if (notes.length > 0) {
		return (
			<div className='notes-page-container'>
				{renderModalTop()}
				<div className='notes-page-content'>
					<section className='notes-page-section'>
						<ul className='notes-page-ul'>
							{currentNotes.map((eachNote) => (
								<NotesItem
									eachNote={eachNote}
									handleUpdate={handleUpdate}
									handleDelete={handleDelete}
									toggleClass={toggleClass}
									noteId={noteId}
									key={eachNote.id}
								/>
							))}
						</ul>
					</section>
				</div>
			</div>
		);
	} else {
		return (
			<div className='notes-page-container'>
				{renderModalTop()}
				<div className='notes-page-content'>
					<section className='notes-page-section'>
						<div className='notes-page-section-empty'>
							{loading ? (
								<span>Notes are loading...</span>
							) : notes.length < 1 ? (
								<span>You don't have any notes.</span>
							) : notes.length < 1 && search.length > 0 ? (
								<span>No notes matching your search.</span>
							) : (
								false
							)}
						</div>
					</section>
				</div>
			</div>
		);
	}
};

/******************************
 *      mapState       *
 ******************************/

const mapState = ({ devos, notes, users, session, errors }) => {
	const noteId = notes.noteId ? notes.noteId : {};

	return {
		currentUser: users[session.id],
		errors: errors,
		devos: Object.values(devos),
		noteId: noteId,
	};
};

const mapDispatch = (dispatch) => ({
	closeModal: () => dispatch(closeModal()),
	fetchNotes: (noteId) => dispatch(fetchNotes()),
	fetchNote: (noteId) => dispatch(fetchNote(noteId)),
	deleteNote: (noteId) => dispatch(deleteNote(noteId)),
});

export default connect(mapState, mapDispatch)(NotesPage);
