import { RECEIVE_DEVO_INDEX, RECEIVE_DEVO, CLEAR_DEVO_STATE, RECEIVE_DEVO_BOOK } from '../actions/devo_actions';

const devosReducer = (oldState = {}, action) => {
	Object.freeze(oldState);
	let newState = Object.assign({}, oldState);

	switch (action.type) {
		case RECEIVE_DEVO_BOOK:
			return Object.assign({}, newState, action.devoBook);

		case RECEIVE_DEVO:
			return Object.assign({}, newState, { mainBodyDevo: action.devo });

		case RECEIVE_DEVO_INDEX:
			let devoIndex = (data) => {
				let hash = {};
				Object.values(data).forEach((ele, i) => (hash[i] = ele));
				return hash;
			};
			delete newState.mainBodyDevo;
			return Object.assign({}, newState, devoIndex(action.devoIndex));

		case CLEAR_DEVO_STATE:
			return {};

		default:
			return oldState;
	}
};

export default devosReducer;
