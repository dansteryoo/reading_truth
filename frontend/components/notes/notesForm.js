import React from 'react';
import { connect } from 'react-redux';
import { fetchNotes, updateNote, createNote } from '../../actions/note_actions';
import { clearErrors } from '../../actions/session_actions';
import { withRouter } from 'react-router-dom';
import { wordIsBlank, sortDevoBook } from '../../helpers/helperFunctions';

/******************************
 *          CONSTANTS         *
 ******************************/

const ERRORS = [
	"ttl can't be blank", // 0 Title
	"bod can't be blank", // 1 Body
	"boo can't be blank", // 2 Book
	"day can't be blank", // 3 Day
	'day must only be a number', // 4 Number
];

const defaultState = {
	id: '',
	title: '',
	category: '',
	day: '',
	body: '',
	updateErrors: [],
	updateForm: false,
	loading: false,
};

/******************************
 *     NotesForm Component    *
 ******************************/

class NotesForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = defaultState;
		this.handleSubmit = this.handleSubmit.bind(this);
		this.renderFormButton = this.renderFormButton.bind(this);
		this.prefillNoteForm = this.prefillNoteForm.bind(this);
	}

	dayIsNumber(day) {
		let splitStr = day.trim().split('');

		for (let i = 0; i < splitStr.length; i++) {
			if (/^[a-zA-Z]*$/.test(splitStr[i])) return false;
		}
		return true;
	}

	componentDidMount() {
		this.props.fetchNotes();
	}

	componentWillUnmount() {
		this.props.clearErrors();
	}

	componentDidUpdate(prevProps) {
		if (this.props.noteId !== prevProps.noteId) {
			//---------- if this.props.noteId is a NUMBER then populate with update first and render update form ----------//
			if (Number.isInteger(this.props.noteId.id)) {
				const { id, title, category, day, body } = this.props.noteId;
				this.setState({
					id,
					title,
					category,
					day,
					body,
					updateForm: true,
				});
			}

			//---------- if notes array is different from current props to prevProps ----------//
			if (this.props.notes.length !== prevProps.notes.length) {
				//---------- AND if current props array is empty SKIP reset state ----------//
				if (this.props.notes.length < 1) return;

				//---------- OR if current props array is NOT EMPTY then reset state ----------//
				if (!this.props.notes.some((ele) => ele.id === this.state.id)) {
					this.setState(defaultState);
				}
			}
		}
	}

	handleChange(f) {
		return (e) => this.setState({ [f]: e.target.value });
	}

	handleCancelUpdate() {
		return this.setState(defaultState);
	}

	handleSubmit(e) {
		e.preventDefault();
		this.setState({ loading: true });

		const { id, title, category, day, body } = this.state;
		let noteUpdate = { id, title, category, day, body };
		let note = { title, category, day, body };

		if (wordIsBlank(title) || wordIsBlank(body) || wordIsBlank(category) || wordIsBlank(day) || !this.dayIsNumber(day)) {
			let errorsArr = [];
			if (wordIsBlank(title)) errorsArr.push(ERRORS[0]); // Title is blank
			if (wordIsBlank(body)) errorsArr.push(ERRORS[1]); // Body is blank
			if (wordIsBlank(category)) errorsArr.push(ERRORS[2]); // Book is blank
			if (wordIsBlank(day)) errorsArr.push(ERRORS[3]); // Day is blank
			if (!this.dayIsNumber(day) && !wordIsBlank(day)) errorsArr.push(ERRORS[4]); // Day is !number
			if (errorsArr.length > 0) return this.setState({ updateErrors: errorsArr });
		} else if (id.length < 1) {
			this.props
				.createNote(note)
				.then(() =>
					this.setState({
						...defaultState,
						success: true,
					})
				)
				.then(() => this.renderSuccessMsg())
				.then(() => this.props.fetchNotes());
		} else {
			this.props
				.updateNote(noteUpdate)
				.then(() =>
					this.setState({
						...defaultState,
						update: true,
					})
				)
				.then(() => this.renderUpdateMsg())
				.then(() => this.props.fetchNotes());
		}
	}

	renderSuccessMsg() {
		window.setTimeout(() => {
			this.setState({ success: false, loading: false });
		}, 3000);
	}

	renderUpdateMsg() {
		window.setTimeout(() => {
			this.setState({ update: false, loading: false });
		}, 3000);
	}

	prefillNoteForm() {
		const { mainBodyDevo, devoBook } = this.props;
		if (!mainBodyDevo || !devoBook) return;
		const mainBodyIndex = devoBook.findIndex((devo) => devo.id === mainBodyDevo.id);
		const { book, title } = mainBodyDevo;
		return this.setState({
			category: book,
			title,
			day: mainBodyIndex + 1,
		});
	}

	renderFormButton() {
		return (
			<div className='button-container'>
				{!this.state.updateForm && (
					<div className='notes-form-prefill' onClick={() => this.prefillNoteForm()}>
						&#9776;
					</div>
				)}
				<button className='notes-form-submit-button' disabled={this.state.loading} type='submit'>
					{this.state.updateForm ? 'Update' : 'Create'}
				</button>
				{this.state.updateForm && (
					<div className='notes-form-cancel-x' onClick={() => this.handleCancelUpdate()}>
						&#10005;
					</div>
				)}
			</div>
		);
	}

	renderErrors() {
		const { updateErrors } = this.state;

		const errorsHash = {
			title: '',
			body: '',
			book: '',
			day: '',
			number: '',
		};

		if (updateErrors.length < 1) return errorsHash;

		updateErrors.forEach((err) => {
			if (ERRORS.indexOf(err) === 0) errorsHash.title = err.slice(3);
			if (ERRORS.indexOf(err) === 1) errorsHash.body = err.slice(3);
			if (ERRORS.indexOf(err) === 2) errorsHash.book = err.slice(3);
			if (ERRORS.indexOf(err) === 3) errorsHash.day = err.slice(3);
			if (ERRORS.indexOf(err) === 4) errorsHash.number = err.slice(3);
		});

		const { title, category, day, body } = this.state;

		if (!wordIsBlank(title)) errorsHash.title = '';
		if (!wordIsBlank(body)) errorsHash.body = '';
		if (!wordIsBlank(category)) errorsHash.book = '';
		if (!wordIsBlank(day)) errorsHash.day = '';
		if (this.dayIsNumber(day)) errorsHash.number = '';

		return errorsHash;
	}

	render() {
		if (this.state.success) {
			return (
				<div className='success-message-div'>
					<span>Note Created!</span>
				</div>
			);
		} else if (this.state.update) {
			return (
				<div className='success-message-div'>
					<span>Note Updated!</span>
				</div>
			);
		} else {
			return (
				<div className='notes-form-container'>
					<form onSubmit={this.handleSubmit}>
						<div className='notes-form'>
							{/* categories and day */}
							<div className='notes-form-book-day'>
								<div className='columns'>
									<div className='form-errors-notes'>
										<label>Book </label> {this.renderErrors().book}
									</div>
									<input
										type='text'
										className='notes-form-input'
										value={this.state.category}
										onChange={this.handleChange('category')}
										// required
									/>
								</div>
								<div className='columns'>
									<div className='form-errors-notes'>
										<label>Day# </label>
										{this.renderErrors().day}
										{this.renderErrors().number}
									</div>
									<input
										type='text'
										className='notes-form-input'
										value={this.state.day}
										onChange={this.handleChange('day')}
										// required
									/>
								</div>
							</div>
							{/* title */}
							<div className='form-errors-notes'>
								<label>Title </label>
								{this.renderErrors().title}
							</div>
							<input
								type='text'
								className='notes-form-input-title'
								onChange={this.handleChange('title')}
								value={this.state.title}
								// required
							/>
							{/* body */}
							<div className='form-errors-notes'>
								<label>Body </label>
								{this.renderErrors().body}
							</div>
							<textarea
								className='notes-form-textarea'
								placeholder={'Enter note here..'}
								onChange={this.handleChange('body')}
								value={this.state.body}
								// required
							/>

							{this.renderFormButton()}
						</div>
					</form>

					<br />
				</div>
			);
		}
	}
}

/******************************
 *       mapStateToProps      *
 ******************************/

const mapStateToProps = ({ session, users, errors, notes, devos }) => {
	const noteId = notes.noteId ? notes.noteId : {};
	const notesArray = notes.noteId ? [] : Object.values(notes);
	const noteErrors = notes.noteErrors ? notes.noteErrors : [];
	const devoBook = devos.devoBook ? Object.values(devos.devoBook) : [];

	return {
		currentUser: users[session.id],
		errors: errors,
		devoBook: sortDevoBook(devoBook),
		mainBodyDevo: devos.mainBodyDevo ?? null,
		notes: notesArray,
		noteId: noteId,
		noteErrors: noteErrors,
	};
};

/******************************
 *     mapDispatchToProps     *
 ******************************/

const mapDispatchToProps = (dispatch) => ({
	fetchNotes: () => dispatch(fetchNotes()),
	updateNote: (note) => dispatch(updateNote(note)),
	createNote: (note) => dispatch(createNote(note)),
	clearErrors: () => dispatch(clearErrors()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NotesForm));
