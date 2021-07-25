import * as NotesAPIUtil from '../util/notes_api_util';

export const RECEIVE_NOTES = 'RECEIVE_NOTES';
export const RECEIVE_NOTE = 'RECEIVE_NOTE';
export const REMOVE_NOTE = 'REMOVE_NOTE';
export const RECEIVE_NOTE_ERRORS = 'RECEIVE_NOTE_ERRORS';
export const CLEAR_NOTE_STATE = 'CLEAR_NOTE_STATE';

export const receiveNotes = (notes) => {
	return {
		type: RECEIVE_NOTES,
		notes,
	};
};

export const receiveNote = (note) => {
	return {
		type: RECEIVE_NOTE,
		note,
	};
};

export const removeNote = (noteId) => {
	return {
		type: REMOVE_NOTE,
		noteId,
	};
};

export const receiveErrors = (errors) => {
	return {
		type: RECEIVE_NOTE_ERRORS,
		errors,
	};
};

export const clearNoteState = () => {
	return {
		type: CLEAR_NOTE_STATE,
	};
};

export const fetchNotes = () => (dispatch) => {
	return NotesAPIUtil.fetchNotes().then((notes) => dispatch(receiveNotes(notes)));
};

export const fetchNote = (noteId) => (dispatch) => {
	return NotesAPIUtil.fetchNote(noteId).then((note) => dispatch(receiveNote(note)));
};

export const createNote = (note) => (dispatch) => {
	return NotesAPIUtil.createNote(note).then(
		(note) => dispatch(receiveNote(note)),
		(err) => dispatch(receiveErrors(err.responseJSON))
	);
};

export const updateNote = (note) => (dispatch) => {
	return NotesAPIUtil.updateNote(note).then(
		(note) => dispatch(receiveNote(note)),
		(err) => dispatch(receiveErrors(err.responseJSON))
	);
};

export const deleteNote = (noteId) => (dispatch) => {
	return NotesAPIUtil.deleteNote(noteId).then(() => dispatch(removeNote(noteId)));
};
