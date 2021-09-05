export const searchRegexMatch = (search) => {
	const input = Array.from(search).reduce(
		(a, v, i) => `${a}[^${search.substring(i)}]*?${v}`,
		''
	);
	return new RegExp(input);
};

export const setPayload = (data) => {
	let payload;
	if (!data) return;

	if (data.book.includes('&')) {
		payload = {
			gender: data.gender,
			book: data.book.replace('&', '%26'),
		};
	} else {
		payload = {
			gender: data.gender,
			book: data.book,
		};
	}

	return payload;
};

export const sortTitles = (data, bibleBooks) => {
	const lowerCaseArr = bibleBooks.map((ele) => ele.toLowerCase());
	return data
		.sort((a, b) => lowerCaseArr.indexOf(a.book) - lowerCaseArr.indexOf(b.book))
		.map((ele) => ele);
};

export const sortAlphabetically = (data) => {
	return data.sort((a, b) => (a.book < b.book ? -1 : 1)).map((ele) => ele);
};

export const wordIsBlank = (word) => {
	return word.trim().length < 1;
};

export const isPasswordMatch = ({ password, passwordMatch }) => {
	return password === passwordMatch;
}

export const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.toLocaleLowerCase().slice(1);
};

export const sortDevoBook = (devoBook) => {
	if (devoBook.length < 1) return devoBook;
	const { gender, book } = devoBook[0];
	const reverseCheck = {
		Exodus: true,
		Numbers: true,
		Deuteronomy: true,
		'1 & 2 Chronicles': true,
		Ezra: true,
		Isaiah: true,
		Jeremiah: true,
		Lamentations: true,
		Ezekiel: true,
		Philemon: true,
	};

	if (
		gender === 'HE' ||
		(gender === 'HE' && reverseCheck[book]) ||
		(gender === 'SHE' && book === 'Judges') ||
		book === 'Job'
	) {
		return devoBook.reverse();
	}
	return devoBook;
};

export const isValidNumber = (num) => {
	return typeof num === 'number';
};

export const isUserBookmarkBlank = (bookmark) => {
	return bookmark == (undefined || null);
};

export const dayIsNumber = (day) => {
	let splitStr = day.trim().split('');
	for (let i = 0; i < splitStr.length; i++) {
		if (/^[a-zA-Z]*$/.test(splitStr[i])) return false;
	}
	return true;
};

export const createTitlePayload = (arrayOfBooks, titleObject) => {
	if (!Array.isArray(arrayOfBooks) || arrayOfBooks.length < 1)
		return arrayOfBooks;
	const lowercaseArray = arrayOfBooks.map((ele) => ele.toLowerCase());
	const bookTitle = arrayOfBooks[lowercaseArray.indexOf(titleObject.book)];
	return {
		gender: titleObject.gender,
		book: bookTitle,
	};
};

export const reformatMapToLowercase = (data) => {
	let hash = {};
	for (let key in data) {
		hash[key.toLowerCase()] = data[key];
	}
	return hash;
};