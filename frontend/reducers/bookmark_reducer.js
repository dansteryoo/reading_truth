import { RECEIVE_BOOKMARK, REMOVE_BOOKMARK } from '../actions/bookmark_actions';

const bookmarkReducer = (oldState = {}, action) => {
	Object.freeze(oldState);
	let newState = Object.assign({}, oldState);

	switch (action.type) {
		case RECEIVE_BOOKMARK:
			return Object.assign({}, newState, action.bookmark);

		case REMOVE_BOOKMARK:
			if (newState.id === action.bookmarkId) {
				return {};
			}

		default:
			return oldState;
	}
};

export default bookmarkReducer;
