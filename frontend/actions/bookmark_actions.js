import * as BookmarkAPIUtil from '../util/bookmark_api_util';

export const RECEIVE_BOOKMARK = 'RECEIVE_BOOKMARK';
export const REMOVE_BOOKMARK = 'REMOVE_BOOKMARK';

export const receiveBookmark = (bookmark) => {
	return {
		type: RECEIVE_BOOKMARK,
		bookmark,
	};
};

export const removeBookmark = (bookmarkId) => {
	return {
		type: REMOVE_BOOKMARK,
		bookmarkId,
	};
};

export const fetchBookmark = () => (dispatch) => {
	return BookmarkAPIUtil.fetchBookmark().then((bookmark) => dispatch(receiveBookmark(bookmark)));
};

export const createBookmark = (bookmark) => (dispatch) => {
	return BookmarkAPIUtil.createBookmark(bookmark).then((bookmark) => dispatch(receiveBookmark(bookmark)));
};

export const deleteBookmark = (bookmarkId) => (dispatch) => {
	return BookmarkAPIUtil.deleteBookmark(bookmarkId).then(() => dispatch(removeBookmark(bookmarkId)));
};
