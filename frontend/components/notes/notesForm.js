import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchNotes, updateNote, createNote } from '../../actions/note_actions';
import { clearErrors } from '../../actions/session_actions';
import { withRouter } from 'react-router-dom';
import { wordIsBlank, sortDevoBook, dayIsNumber } from '../../helpers/helperFunctions';

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

const EMOJI = {
	star: '⭐️',
	heart: '❤️',
	fire: '🔥',
	gold: '🏅',
};

const DEFAULT_STATE = {
	id: '',
	title: '',
	book: '',
	day: '',
	body: '',
	updateErrors: [],
	isUpdate: false,
	isLoading: false,
};

/******************************
 *     NotesForm Component    *
 ******************************/

const NotesForm = ({ mainBodyDevo, devoBook, fetchNotes, clearErrors, createNote, updateNote, noteId }) => {
	const [id, setId] = useState('');
	const [title, setTitle] = useState('');
	const [book, setBook] = useState('');
	const [day, setDay] = useState('');
	const [body, setBody] = useState('');
	const [updateErrors, setUpdateErrors] = useState([]);
	const [success, setSuccess] = useState(false);
	const [isUpdate, setIsUpdate] = useState(false);
	const [isLoading, setIsLoading] = useState(false)
	const mainBodyIndex = devoBook.findIndex((devo) => devo.id === mainBodyDevo?.id);

	useEffect(() => {
		fetchNotes();
		return () => clearErrors();
	}, []);

	useEffect(() => {
		if (typeof noteId.id === 'number') {
			console.log(noteId)
			setId(noteId.id);
			setTitle(noteId.title);
			setBook(noteId.category);
			setDay(noteId.day);
			setBody(noteId.body);
			setIsUpdate(true);
		}
	}, [noteId]);

	const handleEmoji = (emoji) => {
		if (title.includes(emoji)) return;
		let formTitle = mainBodyDevo?.title === title ? title + ' ' + emoji : title + emoji;
		return setTitle(formTitle)
	};

	const renderEmojis = () => {
		if (title.includes(mainBodyDevo?.title)) {
			return (
				<div className='form-title-emojis'>
					<div onClick={() => handleEmoji(EMOJI.star)}>{EMOJI.star}</div>
					<div onClick={() => handleEmoji(EMOJI.heart)}>{EMOJI.heart}</div>
					<div onClick={() => handleEmoji(EMOJI.fire)}>{EMOJI.fire}</div>
					<div onClick={() => handleEmoji(EMOJI.gold)}>{EMOJI.gold}</div>
				</div>
			);
		}
	};

	const setDefaultState = () => {
		setId('');
		setTitle('');
		setBook('');
		setDay('');
		setBody('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const noteObject = { id, title, book, day, body };

		if (wordIsBlank(title) || wordIsBlank(body) || wordIsBlank(book) || wordIsBlank(day) || !dayIsNumber(day)) {
			let errArray = [];
			if (wordIsBlank(title)) errArray.push(ERRORS[0]); // Title is blank
			if (wordIsBlank(body)) errArray.push(ERRORS[1]); // Body is blank
			if (wordIsBlank(book)) errArray.push(ERRORS[2]); // Book is blank
			if (wordIsBlank(day)) errArray.push(ERRORS[3]); // Day is blank
			if (!dayIsNumber(day) && !wordIsBlank(day)) errArray.push(ERRORS[4]); // Day is !number
			if (errArray.length > 0) return setUpdateErrors(errArray);
		} else {
			id.length < 1 ? createNote(noteObject) : updateNote(noteObject);
			setDefaultState();
			setSuccess(true);
			renderConfirmation();
			fetchNotes();
		}
	};

	const renderConfirmation = () => {
		window.setTimeout(() => {
			setSuccess(false);
		}, 3000);
	};

	const prefillNoteForm = () => {
		const day = (mainBodyIndex + 1).toString();
		setBook(mainBodyDevo?.book);
		setTitle(mainBodyDevo?.title);
		setDay(day);
	};

	const renderFormButton = () => {
		return (
			<div className='button-container'>
				{!isUpdate && mainBodyDevo && (
					<div className='notes-form-prefill' onClick={() => prefillNoteForm()}>
						&#9776;
					</div>
				)}
				<button className='notes-form-submit-button' disabled={isLoading} type='submit'>
					{isUpdate ? 'Update' : 'Create'}
				</button>
				{isUpdate && (
					<div className='notes-form-cancel-x' onClick={() => setDefaultState()}>
						&#10005;
					</div>
				)}
			</div>
		);
	};

	const renderErrors = () => {
		const errObject = {
			title: '',
			body: '',
			book: '',
			day: '',
			number: '',
		};
		if (updateErrors.length < 1) return errObject;

		updateErrors.forEach((err) => {
			if (ERRORS.indexOf(err) === 0) errObject.title = err.slice(3);
			if (ERRORS.indexOf(err) === 1) errObject.body = err.slice(3);
			if (ERRORS.indexOf(err) === 2) errObject.book = err.slice(3);
			if (ERRORS.indexOf(err) === 3) errObject.day = err.slice(3);
			if (ERRORS.indexOf(err) === 4) errObject.number = err.slice(3);
		});

		if (!wordIsBlank(title)) errObject.title = '';
		if (!wordIsBlank(body)) errObject.body = '';
		if (!wordIsBlank(book)) errObject.book = '';
		if (!wordIsBlank(day)) errObject.day = '';
		if (dayIsNumber(day)) errObject.number = '';

		return errObject;
	};

	if (success && !isUpdate) {
		return (
			<div className='success-message-div'>
				<span>Note Created!</span>
			</div>
		);
	} else if (success && isUpdate) {
		return (
			<div className='success-message-div'>
				<span>Note Updated!</span>
			</div>
		);
	} else {
		return (
			<div className='notes-form-container'>
				<form onSubmit={handleSubmit}>
					<div className='notes-form'>
						{/* categories and day */}
						<div className='notes-form-book-day'>
							<div className='columns'>
								<div className='form-errors-notes'>
									<label>Book </label> {renderErrors().book}
								</div>
								<input
									type='text'
									className='notes-form-input'
									value={book}
									onChange={(e) => setBooko(e.target.value)}
									// required
								/>
							</div>
							<div className='columns'>
								<div className='form-errors-notes'>
									<label>Day# </label>
									{renderErrors().day}
									{renderErrors().number}
								</div>
								<input
									type='text'
									className='notes-form-input'
									value={day}
									onChange={(e) => setDay(e.target.value)}
									// required
								/>
							</div>
						</div>
						{/* title */}
						<div className='form-errors-notes'>
							<label>Title </label>
							{renderErrors().title}
						</div>
						{renderEmojis()}
						<input
							type='text'
							className='notes-form-input-title'
							onChange={(e) => setTitle(e.target.value)}
							value={title}
							// required
						/>
						{/* body */}
						<div className='form-errors-notes'>
							<label>Body </label>
							{renderErrors().body}
						</div>
						<textarea
							className='notes-form-textarea'
							placeholder={'Enter note here..'}
							onChange={(e) => setBody(e.target.value)}
							value={body}
							// required
						/>
						{renderFormButton()}
					</div>
				</form>

				<br />
			</div>
		);
	}
};

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
