import React from 'react';
import NotesItem from './NotesItem';
import Pagination from './Pagination';
import { searchRegexMatch } from '../../helpers/helperFunctions';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modal_actions';
import { fetchNote, fetchNotes, deleteNote } from '../../actions/note_actions';

class NotesContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			noteId: '',
			search: '',
			notes: [],
			defaultSorted: [],
			checked: false,
			currentPage: 1,
			notesPerPage: 40,
			loading: false,
		};

		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleCheck = this.handleCheck.bind(this);
		this.toggleClass = this.toggleClass.bind(this);
		this.renderModalTop = this.renderModalTop.bind(this);
		this.sortByType = this.sortByType.bind(this);
	}

	componentDidMount() {
		this.setState({ loading: true });
		this.props.fetchNotes().then(() =>
			setTimeout(() => {
				this.setState({
					notes: this.props.notes,
					defaultSorted: this.sortByType(this.props.notes, 'created_at'),
					loading: false,
				});
			}, 500)
		);
	}

	componentDidUpdate(prevProps) {
		const { notes, search, defaultSorted, checked } = this.state;

		//---------- defaultSorted on blank search input ----------//
		if (
			JSON.stringify(notes) !== JSON.stringify(defaultSorted) &&
			search.length < 1 &&
			checked === false
		) {
			return this.setState({ notes: defaultSorted });
		}

		if (prevProps.notes.length !== this.props.notes.length) {
			return this.setState({
				notes: this.props.notes,
				defaultSorted: this.sortByType(this.props.notes, 'created_at'),
			});
		}
	}

	sortByType(notes, type) {
		let sortedNotes = notes
			.sort((a, b) =>
				a[`${type}`].toLowerCase() < b[`${type}`].toLowerCase() ? -1 : 1
			)
			.map((ele) => ele);

		type === 'updated_at' ? sortedNotes.reverse() : sortedNotes;
		return sortedNotes;
	}

	handleUpdate(noteId) {
		this.props.fetchNote(noteId).then(() => this.props.closeModal());
	}

	handleDelete(noteId) {
		this.props.deleteNote(noteId).then(() => this.props.fetchNotes());
	}

	toggleClass(noteId) {
		this.setState({ noteId });
	}

	handleCheck(e) {
		const checkbox = e.target.value;

		let myCheckbox = document.getElementsByName('checkbox');
		let checkboxBool = [];

		myCheckbox.forEach((ele) => {
			if (checkbox !== ele.value) ele.checked = false;
			checkboxBool.push(ele.checked === true);
		});

		const { notes } = this.state;
		//---------- default byCreated sort on blank checkboxes ----------//
		if (!checkboxBool.includes(true)) {
			return this.setState({
				notes: this.sortByType(notes, 'created_at'),
				checked: false,
			});
		} else {
			this.setState({ checked: true });

			switch (checkbox) {
				case 'byBook':
					return this.setState({
						notes: this.sortByType(notes, 'category'),
					});

				case 'byUpdated':
					return this.setState({
						notes: this.sortByType(notes, 'updated_at'),
					});
			}
		}
	}

	handleSearch(e) {
		const search = e.target.value;
		this.setState({ search });

		//---------- helper_func ----------//
		const searchData = searchRegexMatch(search.toLowerCase());

		const sortNotes = this.props.notes.filter((each) => {
			let sortTitles = each.title.toLowerCase().match(searchData);
			let sortBody = each.body.toLowerCase().match(searchData);
			let sortBook = each.category.toLowerCase().match(searchData);

			return sortTitles || sortBody || sortBook;
		});

		const { checked } = this.state;
		let myCheckbox = document.getElementsByName('checkbox');
		let checkboxName = [];

		myCheckbox.forEach((ele) => {
			if (ele.checked === true) checkboxName.push(ele.value);
		});

		if (checked) {
			if (checkboxName.includes('byBook')) {
				return this.setState({
					notes: this.sortByType(sortNotes, 'category'),
				});
			} else {
				return this.setState({
					notes: this.sortByType(sortNotes, 'updated_at'),
				});
			}
		} else {
			return this.setState({
				notes: this.sortByType(sortNotes, 'created_at'),
			});
		}
	}

	renderModalTop() {
		const { currentUser, closeModal } = this.props;
		const { notes, notesPerPage, currentPage } = this.state;
		const totalNotes = notes.length;
		const maxPage = Math.ceil(totalNotes / notesPerPage);
		const lastNote = Math.min(currentPage * notesPerPage, totalNotes);
		const firstNote = currentPage * notesPerPage - notesPerPage + 1;

		// Change page
		const paginate = (pageNumber) => this.setState({ currentPage: pageNumber });

		const nextPage = () => {
			currentPage < maxPage && this.setState({ currentPage: currentPage + 1 });
		};

		const prevPage = () => {
			currentPage > 1 && this.setState({ currentPage: currentPage - 1 });
		};

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
							value={this.state.search}
							onChange={this.handleSearch}
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
							onChange={this.handleCheck}
						/>
						<span className='checkmark'></span>
					</label>
					<label className='container'>
						By Updated
						<input
							type='checkbox'
							name='checkbox'
							value='byUpdated'
							onChange={this.handleCheck}
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
	}

	render() {
		const { fetchNote, deleteNote } = this.props;
		const { notes, search, currentPage, notesPerPage, loading } = this.state;

		// Get current notes
		const idxOfLastNote = currentPage * notesPerPage;
		const idxOfFirstNote = idxOfLastNote - notesPerPage;
		const currentNotes = notes.slice(idxOfFirstNote, idxOfLastNote);

		if (notes.length > 0) {
			return (
				<div className='notes-page-container'>
					{this.renderModalTop()}
					<div className='notes-page-content'>
						<section className='notes-page-section'>
							<ul className='notes-page-ul'>
								{currentNotes.map((eachNote) => (
									<NotesItem
										handleUpdate={this.handleUpdate}
										toggleClass={this.toggleClass}
										noteId={this.state.noteId}
										handleDelete={this.handleDelete}
										fetchNote={fetchNote}
										eachNote={eachNote}
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
					{this.renderModalTop()}
					<div className='notes-page-content'>
						<section className='notes-page-section'>
							<div className='notes-page-section-empty'>
								{loading === true ? (
									<span>Notes are loading...</span>
								) : this.props.notes.length < 1 ? (
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
	}
}

/******************************
 *      mapState       *
 ******************************/

const mapState = ({ devos, notes, users, session, errors }) => {
	const noteId = notes.noteId ? notes.noteId : {};

	return {
		currentUser: users[session.id],
		errors: errors,
		devos: Object.values(devos),
		notes: notes.noteId ? [] : Object.values(notes),
		noteId: noteId,
	};
};

const mapDispatch = (dispatch) => ({
	closeModal: () => dispatch(closeModal()),
	fetchNotes: (noteId) => dispatch(fetchNotes()),
	fetchNote: (noteId) => dispatch(fetchNote(noteId)),
	deleteNote: (noteId) => dispatch(deleteNote(noteId)),
});

export default connect(mapState, mapDispatch)(NotesContainer);
