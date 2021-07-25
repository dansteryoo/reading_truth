import { combineReducers } from 'redux';
import SessionReducer from './session_reducer';
import SessionErrorsReducer from './session_errors_reducer';
import ModalReducer from './modal_reducer';
import UsersReducer from './users_reducer';
import DevosReducer from './devos_reducer';
import NotesReducer from './notes_reducer';
import BookmarkReducer from './bookmark_reducer';

const RootReducer = combineReducers({
	users: UsersReducer,
	session: SessionReducer,
	errors: SessionErrorsReducer,
	modal: ModalReducer,
	devos: DevosReducer,
	notes: NotesReducer,
	bookmark: BookmarkReducer,
});

export default RootReducer;
