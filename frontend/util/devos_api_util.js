export const fetchDevoIndex = () => {
	return $.ajax({
		url: `/api/devos`,
		method: 'GET',
	});
};

export const fetchDevo = (devoId) => {
	return $.ajax({
		url: `/api/devos/${devoId}`,
		method: 'GET',
	});
};

export const fetchDevoBook = (devoBook) => {
	return $.ajax({
		url: `api/book/?book=${devoBook.book}&gender=${devoBook.gender}`,
		method: 'GET',
	});
};
