import * as DevosAPIUtil from '../util/devos_api_util';

export const RECEIVE_DEVO = 'RECEIVE_DEVO';
export const CLEAR_DEVO_STATE = 'CLEAR_DEVO_STATE';
export const RECEIVE_DEVO_BOOK = 'RECEIVE_DEVO_BOOK';
export const RECEIVE_DEVO_INDEX = 'RECEIVE_DEVO_INDEX';

export const receiveDevoIndex = (devoIndex) => {
	return {
		type: RECEIVE_DEVO_INDEX,
		devoIndex,
	};
};

export const receiveDevoBook = (devoBook) => {
	return {
		type: RECEIVE_DEVO_BOOK,
		devoBook,
	};
};

export const receiveDevo = (devo) => {
	return {
		type: RECEIVE_DEVO,
		devo,
	};
};

export const clearDevoState = () => {
	return {
		type: CLEAR_DEVO_STATE,
	};
};

export const fetchDevoIndex = () => (dispatch) => {
	return DevosAPIUtil.fetchDevoIndex().then((devoIndex) => dispatch(receiveDevoIndex(devoIndex)));
};

export const fetchDevoBook = (devoBook) => (dispatch) => {
	return DevosAPIUtil.fetchDevoBook(devoBook).then((devoBook) => dispatch(receiveDevoBook(devoBook)));
};

export const fetchDevo = (devoId) => (dispatch) => {
	return DevosAPIUtil.fetchDevo(devoId).then((devo) => dispatch(receiveDevo(devo)));
};
