import React, { useState, useEffect } from 'react';
import { useMount } from 'ahooks';
import axios from 'axios';
import { connect } from 'react-redux';
import { closeModal, openModal } from '../../actions/modal_actions';
import { fetchDevo, fetchDevoBook } from '../../actions/devo_actions';
import { clearErrors } from '../../actions/session_actions';
import {
	createBookmark,
	fetchBookmark,
	deleteBookmark,
} from '../../actions/bookmark_actions';
import {
	sortDevoBook,
	isNumber,
	setPayload,
	createTitlePayload,
} from '../../helpers/helperFunctions';
import {
	regBibleTitles,
	maxMcLeanBooks,
	OTbooks, 
	NTbooks, 
} from '../../helpers/bookTitles';

const ALL_BOOK_TITLES = [...OTbooks, ...NTbooks];
const BOOK_TITLE_REF = {
	prev: null,
	next: null,
}

const splitPassages = (passages) => {
	if (passages.length > 0) {
		return passages.split(', ').map((ele) => ele.trim());
	}
};
const checkForNumber = (data) => {
	return data.match(/^([1-9]|[1-8][0-9]|9[0-9]|1[0-4][0-9]|150)$/g);
};

/******************************
 *     MainBody Component     *
 ******************************/

const MainBody = ({
	mainBodyDevo,
	currentUser,
	fetchDevo,
	fetchDevoBook,
	bookmark,
	createBookmark,
	deleteBookmark,
	devoBook,
}) => {
	const mainBodyIsNull = mainBodyDevo === null;
	const devoBookIsEmpty = devoBook.length < 1;
	const [bookmarkId, setBookmarkId] = useState('');
	const [id, setId] = useState('');
	const [gender, setGender] = useState('');
	const [book, setBook] = useState('');
	const [title, setTitle] = useState('');
	const [passages, setPassage] = useState([]);
	const [esvPassage, setEsvPassage] = useState([]);
	const [summary, setSummary] = useState('');
	const [img, setImg] = useState('');
	const [renderDay, setRenderDay] = useState('');
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [mainBodyChanged, setMainBodyChanged] = useState(false);

	/******************************
	 *          useMount          *
	 ******************************/

	useMount(() => {
		const currentPage = handleLocalStorage('getCurrentPage');
		if (currentPage) {
			return fetchDevo(currentPage.id).then(() => {
				setRenderDay(currentPage.renderDay);
				setBookmarkId(currentPage.bookmarkId);
				setIsBookmarked(true);
			});
		} else if (currentUser?.bookmark) {
			return fetchDevo(currentUser.bookmark.devo_id).then(() => {
				setRenderDay(currentUser.bookmark.render_day);
				setBookmarkId(currentUser.bookmark.id);
				setIsBookmarked(true);
			});
		}
	});

	/******************************
	 *         useEffect          *
	 ******************************/

	// render mainBody from different devoBookTitle
	useEffect(() => {
		if (!devoBookIsEmpty && devoBook[0].book !== book) {
			setId(null);
			const currentBookTitle = devoBook[0].book;

			if (currentBookTitle === BOOK_TITLE_REF.prev) {
				fetchDevo(devoBook[devoBook.length - 1].id);
				BOOK_TITLE_REF.prev = null;
			}
			if (currentBookTitle === BOOK_TITLE_REF.next) {
				fetchDevo(devoBook[0].id);
				BOOK_TITLE_REF.next = null;
			}
		}
	}, [devoBook]);

	// render mainBody from different devo of same devoBookTitle
	useEffect(() => {
		if (mainBodyChanged) setMainBodyChanged(false);
		const { currentDay } = findMainBodyIndex();
		if (currentDay && currentDay !== renderDay) setRenderDay(currentDay);

		if (mainBodyDevo?.id && id !== mainBodyDevo.id) {
			handleGetEsvPassages(mainBodyDevo.passages);
			setId(mainBodyDevo.id);
			setPassage(mainBodyDevo.passages);
			setSummary(mainBodyDevo.summary);
			setTitle(mainBodyDevo.title);
			setGender(mainBodyDevo.gender);
			setBook(mainBodyDevo.book);
			setMainBodyChanged(true);
			setImg(
				gender === 'SHE'
					? img === ''
						? 'https://res.cloudinary.com/dmwoxjusp/image/upload/v1630169994/shereads-logo_s9lsvp.jpg'
						: img
					: img === ''
					? 'https://res.cloudinary.com/dmwoxjusp/image/upload/v1630169994/hereads-logo_r2fecj.jpg'
					: img
			);
			
			const currentPage = handleLocalStorage('getCurrentPage');
			if (currentPage?.id === mainBodyDevo.id) {
				setBookmarkId(currentPage.bookmarkId);
				setIsBookmarked(true);
			} else {
				setBookmarkId('');
				setIsBookmarked(false);
			}
		}
	}, [mainBodyDevo]);

	/******************************
	 *    handleGetEsvPassages    *
	 ******************************/

	const handleGetEsvPassages = async (passages) => {
		if (passages.length < 1) return;
		setEsvPassage([]);
		const esvKeys = [
			window.esv_one,
			window.esv_two,
			window.esv_three,
			window.esv_four,
			window.esv_five,
			window.esv_six,
		];
		const randomGen = esvKeys[Math.floor(Math.random() * esvKeys.length)];
		const passagesArray = splitPassages(passages);
		const getPassages = passagesArray.map((passage) => {
			return axios.get('https://api.esv.org/v3/passage/text/?', {
				crossDomain: true,
				params: {
					q: passage,
					'include-headings': false,
					'include-footnotes': false,
					'include-verse-numbers': false,
					'include-short-copyright': false,
					'include-passage-references': false,
				},
				headers: {
					Authorization: randomGen,
				},
			});
		});

		return Promise.all(getPassages)
			.then((results) => {
				const esvArray = results.reduce((arr, { status, config, data }) => {
					if (status === 200) {
						arr.push({
							passage: config.params.q,
							text: data.passages[0],
						});
					}
					return arr;
				}, []);
				setEsvPassage(esvArray);
			})
			.catch((err) => console.log({ err }));
	};

	/******************************
	 *    findMainBodyIndex    *
	 ******************************/

	const findMainBodyIndex = () => {
		if (mainBodyDevo) {
			const currentMainBodyDevoIndex = devoBook.findIndex(
				(devo) => devo.id === mainBodyDevo?.id
			);
			return {
				currentMainBodyDevoIndex,
				currentDay: currentMainBodyDevoIndex + 1,
			};
		}
		return {
			currentMainBodyDevoIndex: null,
			currentDay: null,
		};
	};

	/******************************
	 *     handleLocalStorage     *
	 ******************************/

	const handleLocalStorage = (type) => {
		let userId = JSON.stringify(currentUser.id);

		switch (type) {
			case 'getCurrentPage':
				return JSON.parse(localStorage.getItem(userId));

			case 'setCurrentPage':
				return localStorage.setItem(
					userId,
					JSON.stringify({
						bookmarkId,
						gender,
						book,
						id,
						title,
						passages,
						summary,
						img,
						esvPassage,
						mainBodyChanged,
						bookmark,
						renderDay,
					})
				);

			case 'removeCurrentPage':
				return localStorage.removeItem(userId);

			default:
				return;
		}
	};

	/******************************
	 *       renderPassages       *
	 ******************************/

	const renderPassages = () => {
		if (passages.length < 1) return;
		const arrayOfPassages = splitPassages(passages);
		if (esvPassage.length !== arrayOfPassages.length) return;

		const esvSortMatch = esvPassage.sort(function (a, b) {
			return (
				arrayOfPassages.indexOf(a.passage) - arrayOfPassages.indexOf(b.passage)
			);
		});

		//---------- CATCH undefined ESV API returns ----------//
		const newEsvData = esvSortMatch.filter((ele, i) => {
			if (!ele.text) {
				return console.log(`ESV PASSAGE ERROR IN: 
                    index(${i}), 
                    passage(${JSON.stringify(ele.passage)}), 
                    text(${JSON.stringify(ele.text)})`);
			}
			return ele;
		});

		return newEsvData.map((each, i) => {
			//---------- itemCount TRACKING each item ----------//
			const itemCount = [];
			const eachText = each.text.split('\n').map((passageText, j) => {
				//---------- passageTextCount.push STORES each passageText into passageTextCount ----------//
				itemCount.push(passageText.trim());

				//---------- checking if prevItem !== current passageText ----------//
				if (itemCount[j - 1] !== passageText.trim()) {
					return (
						<p key={'bible-text' + j}>
							{passageText}
							<br />
						</p>
					);
				}
			});

			return (
				<li key={'esv-passages' + i}>
					<span className='bible-passage'>{each.passage}</span>
					<br />
					<br />
					{eachText}
				</li>
			);
		});
	};

	/******************************
	 *    renderSummary    *
	 ******************************/

	const renderSummary = () => {
		const eleCount = [];

		return summary.split('\n').map((ele, i) => {
			const scripture = ele.slice(0, 17) === 'Scripture Reading';
			const text = ele.slice(0, 5) === 'Text:';
			const author_1 = ele.slice(0, 10) === 'Written by';
			const author_2 = ele.slice(0, 10) === 'Written By';
			const eleCountMatch =
				eleCount[i - 1] === ele.trim() && ele.trim().length < 1;

			//---------- eleCount.push STORES each item into eleCount ----------//
			scripture || text ? eleCount.push('') : eleCount.push(ele.trim());

			if (!eleCountMatch && !scripture && !text) {
				if (author_1) ele = ele.replace('Written by', 'By');
				if (author_2) ele = ele.replace('Written By', 'By');

				return (
					<li key={'summary' + i}>
						<p>
							{ele}
							<br />
						</p>
					</li>
				);
			}
		});
	};

	/******************************
	 *       toggleMainBody       *
	 ******************************/

	const toggleMainBody = (type) => {
		const { currentMainBodyDevoIndex } = findMainBodyIndex();
		const currentBookTitleIndex = ALL_BOOK_TITLES.indexOf(book);

		const previousBookTitle =
			currentBookTitleIndex === 0
				? ALL_BOOK_TITLES[ALL_BOOK_TITLES.length - 1]
				: ALL_BOOK_TITLES[currentBookTitleIndex - 1];

		const nextBookTitle =
			currentBookTitleIndex === ALL_BOOK_TITLES.length - 1
				? ALL_BOOK_TITLES[0]
				: ALL_BOOK_TITLES[currentBookTitleIndex + 1];
		
		const fetchPayload = (bookTitle) => {
			const fetchBookPayload = createTitlePayload(ALL_BOOK_TITLES, {
				gender: gender.toUpperCase(),
				book: bookTitle.toLowerCase(),
			});
			console.log({
				gender: gender.toUpperCase(),
				book: bookTitle.toLowerCase(),
			});
			return fetchDevoBook(setPayload(fetchBookPayload));
		};

		switch (type) {
			case 'previous':
				if (currentMainBodyDevoIndex === 0) {
					BOOK_TITLE_REF.prev = previousBookTitle;
					fetchPayload(previousBookTitle);
				}
				return fetchDevo(devoBook[currentMainBodyDevoIndex - 1]?.id);

			case 'next':
				if (currentMainBodyDevoIndex === devoBook.length - 1) {
					BOOK_TITLE_REF.next = nextBookTitle;
					fetchPayload(nextBookTitle);
				}
				return fetchDevo(devoBook[currentMainBodyDevoIndex + 1]?.id);

			default:
				return;
		}
	};

	/******************************
	 *       toggleBookmark       *
	 ******************************/

	const toggleBookmark = () => {
		if (isBookmarked) {
			deleteBookmark(bookmarkId);
			handleLocalStorage('removeCurrentPage');
		} else {
			createBookmark({
				gender,
				book,
				user_id: currentUser.id,
				devo_id: id,
				render_day: renderDay,
			});
			handleLocalStorage('setCurrentPage');
		}
		setIsBookmarked(!isBookmarked);
	};

	/******************************
	 *        toggleAudio         *
	 ******************************/

	const toggleAudio = () => {
		const passageSplit = esvPassage[0].passage.split(' ');
		const chapter = passageSplit[passageSplit.length - 1].split(':')[0];
		let book = passageSplit[0];

		if (checkForNumber(book)) {
			book = `${book} ${passageSplit[1]}`;
		} else if (book === 'Song') {
			book = 'Song of Songs';
		}

		const bookName = maxMcLeanBooks[regBibleTitles.indexOf(book)];
		const url = `https://www.biblegateway.com/audio/mclean/esv/${bookName}.${chapter}`;
		const windowName = 'Max McLean Audio';
		const windowParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
            width=330,height=460,left=100,top=100`;

		if (bookName !== undefined) {
			return window.open(url, windowName, windowParams);
		}
	};

	/******************************
	 *          render            *
	 ******************************/

	if ((mainBodyIsNull && !devoBookIsEmpty) || !id) return <></>;
	return (
		<div className='middle-container'>
			<div className='devo-main-title-wrapper'>
				<div className='devo-main-title'>
					<span className='devo-main-day'>Day {renderDay}:</span>
					<span>{title}</span>
				</div>
				<div className='devo-main-title-icons'>
					<i
						id='previous-arrow'
						className='fas fa-caret-left icons'
						onClick={() => toggleMainBody('previous')}
					></i>
					<i
						id='next-arrow'
						className='fas fa-caret-right icons'
						onClick={() => toggleMainBody('next')}
					></i>
					<i
						id='max-mclean-audio'
						className='fa fa-volume-up icons'
						onClick={() => toggleAudio()}
						aria-hidden='true'
					></i>
					<i
						id='bookmark'
						className={
							isBookmarked ? 'fa fa-bookmark icons' : 'fa fa-bookmark-o icons'
						}
						onClick={() => toggleBookmark()}
						aria-hidden='true'
					></i>
				</div>
			</div>
			<div className='devo-main-container'>
				<div className='form-or-separator-mainbody-passages'>
					<hr />
				</div>
				<div className='devo-main-passages'>
					<span>{renderPassages()}</span>
				</div>
				<div className='form-or-separator-mainbody-summary'>
					<hr />
				</div>
				<div className='devo-main-body'>
					<br />
					<div>{renderSummary()}</div>
					<br />
				</div>
				<div className='form-or-separator-mainbody-image'>
					<hr />
				</div>
				<div className='devo-main-image'>
					<img src={img} />
				</div>
			</div>
		</div>
	);
};

const mapState = ({ session, users, devos, bookmark, errors }) => {
	const devoBook = devos.devoBook ? Object.values(devos.devoBook) : [];
	return {
		currentUser: users[session.id],
		mainBodyDevo: devos.mainBodyDevo ?? null,
		errors,
		devoBook: sortDevoBook(devoBook),
		bookmark,
	};
};

const mapDispatch = (dispatch) => ({
	closeModal: () => dispatch(closeModal()),
	openModal: (formType) => dispatch(openModal(formType)),
	clearErrors: () => dispatch(clearErrors()),
	fetchDevo: (devoId) => dispatch(fetchDevo(devoId)),
	createBookmark: (bookmark) => dispatch(createBookmark(bookmark)),
	fetchBookmark: () => dispatch(fetchBookmark()),
	deleteBookmark: (bookmarkId) => dispatch(deleteBookmark(bookmarkId)),
	fetchDevoBook: (book) => dispatch(fetchDevoBook(book)),
});

export default connect(mapState, mapDispatch)(MainBody);
