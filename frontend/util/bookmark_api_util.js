export const createBookmark = (bookmark) => {
	return $.ajax({
		url: `api/bookmarks/`,
		method: 'POST',
		data: { bookmark },
	});
};

export const deleteBookmark = (bookmarkId) => {
	return $.ajax({
		url: `api/bookmarks/${bookmarkId}`,
		method: 'DELETE',
	});
};

export const fetchBookmark = () => {
	return $.ajax({
		url: `api/bookmarks/`,
		method: 'GET',
	});
};
