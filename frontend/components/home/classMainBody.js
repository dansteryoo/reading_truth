import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { closeModal, openModal } from '../../actions/modal_actions';
import { fetchDevo } from '../../actions/devo_actions';
import { clearErrors } from '../../actions/session_actions';
import {
	createBookmark,
	fetchBookmark,
	deleteBookmark,
} from '../../actions/bookmark_actions';
import { sortDevoBook } from '../../helpers/helperFunctions';
import { regBibleTitles, maxMcLeanBooks } from '../../helpers/bookTitles';

class MainBody extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			bookmarkId: '',
			gender: '',
			book: '',
			id: '',
			title: '',
			passages: [],
			summary: '',
			img: '',
			esvPassage: [],
			mainBodyChanged: false,
			bookmark: false,
			renderDay: '',
		};

		this.ESVpassageGetter = this.ESVpassageGetter.bind(this);
		this.myRef = React.createRef();
		this.toggleBookmark = this.toggleBookmark.bind(this);
		this.toggleAudio = this.toggleAudio.bind(this);
		this.toggleMainBody = this.toggleMainBody.bind(this);
		this.isMainBodyDevoNull = this.isMainBodyDevoNull.bind(this);
		this.userBookmarkBlank = this.userBookmarkBlank.bind(this);
		this.setBookmark = this.setBookmark.bind(this);
		this.localStorageFunc = this.localStorageFunc.bind(this);
		this.splitPassages = this.splitPassages.bind(this);
		this.isValidNumber = this.isValidNumber.bind(this);
		this.findMainBodyIndex = this.findMainBodyIndex.bind(this);
	}

	//---------- ESV.ORG API CALL ----------//

	ESVpassageGetter(passages) {
		const esvKeys = [
			window.esv_one,
			window.esv_two,
			window.esv_three,
			window.esv_four,
			window.esv_five,
			window.esv_six,
		];
		let randomGen = esvKeys[Math.floor(Math.random() * esvKeys.length)];
		let esvArr = [];

		Promise.all(
			this.splitPassages(passages).map((passage) => {
				axios
					.get('https://api.esv.org/v3/passage/text/?', {
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
					})
					.then((res) => {
						if (res.status === 200) {
							return esvArr.push({
								passage: res.config.params.q,
								text: res.data.passages[0],
							});
						}
					})
					.then(() => {
						esvArr.length == this.splitPassages(passages).length &&
							this.setState({ esvPassage: esvArr });
					});
			})
		);
	}

	setBookmark() {
		//---------- SET BOOKMARK TO TRUE ----------//
		if (!this.state.bookmark && this.state.mainBodyChanged) {
			if (
				this.localStorageFunc('getCurrentPage') &&
				this.localStorageFunc('getCurrentPage').id === this.state.id
			) {
				return this.setState({ bookmark: true });
			}
		}
	}

	isValidNumber(number) {
		return typeof number === 'number';
	}

	splitPassages(passages) {
		if (passages.length > 0) {
			return passages.split(', ').map((ele) => ele.trim());
		}
	}

	isMainBodyDevoNull() {
		return this.props.mainBodyDevo === null;
	}

	userBookmarkBlank() {
		const { bookmark } = this.props.currentUser;
		return bookmark == (undefined || null);
	}

	localStorageFunc(condition) {
		let userId = JSON.stringify(this.props.currentUser.id);

		switch (condition) {
			case 'getCurrentPage':
				return JSON.parse(localStorage.getItem(userId));

			case 'setCurrentPage':
				return localStorage.setItem(userId, JSON.stringify(this.state));

			case 'removeCurrentPage':
				return localStorage.removeItem(userId);

			default:
				return;
		}
	}

	//---------- REACT LIFE CYCLES ----------//

	componentDidMount() {
		this.setBookmark();
		const currentPage = this.localStorageFunc('getCurrentPage');
		const { currentUser, fetchDevo } = this.props;

		//---------- IF localStorage EXISTS then setState ----------//
		if (currentPage) {
			return fetchDevo(currentPage.id).then(() =>
				this.setState({
					renderDay: currentPage.render_day,
					bookmarkId: currentPage.bookmarkId,
					bookmark: true,
				})
			);
		} else if (!this.userBookmarkBlank()) {
			return fetchDevo(currentUser.bookmark.devo_id).then(() =>
				this.setState({
					renderDay: currentUser.bookmark.render_day,
					bookmarkId: currentUser.bookmark.id,
					bookmark: true,
				})
			);
		}
	}

	componentDidUpdate(prevProps) {
		this.setBookmark();
		const { bookmark, mainBodyDevo, currentUser } = this.props;
		const { bookmarkId, id, renderDay, mainBodyChanged } = this.state;
		const bookmarkBlank = Object.values(bookmark).length < 1;

		if (this.isMainBodyDevoNull()) return;

		//---------- SET bookmarkId === bookmark.id ----------//
		!bookmarkBlank &&
			bookmarkId !== bookmark.id &&
			id === bookmark.devo_id &&
			this.setState({ bookmarkId: bookmark.id });

		//---------- SET bookmarkId === currentUser.bookmark.id ----------//
		!this.isValidNumber(bookmarkId) &&
			bookmarkBlank &&
			currentUser.bookmark &&
			bookmarkId !== currentUser.bookmark.id &&
			this.setState({ bookmarkId: currentUser.bookmark.id });

		//---------- SET renderDay to this.findMainBodyIndex() + 1 ----------//
		const newRenderDay = this.findMainBodyIndex() + 1;
		newRenderDay !== renderDay && this.setState({ renderDay: newRenderDay });

		//---------- PREVENTS MULTIPLE this.setState on update ----------//
		mainBodyChanged && this.setState({ mainBodyChanged: false });

		//---------- UPDATES new mainBodyDevo ----------//
		if (prevProps.mainBodyDevo !== mainBodyDevo) {
			const { id, img, passages, summary, title, gender, book } = mainBodyDevo;

			//---------- SCROLL TO TOP on render ----------//
			this.myRef.current.scrollTo(0, 0);

			//---------- PREVENTS DUPS in esvPassage ----------//
			this.setState({ esvPassage: [] });
			this.ESVpassageGetter(passages);
			const devoImage =
				gender === 'SHE'
					? img === ''
						? 'https://res.cloudinary.com/dmwoxjusp/image/upload/v1630169994/shereads-logo_s9lsvp.jpg'
						: img
					: img === ''
					? 'https://res.cloudinary.com/dmwoxjusp/image/upload/v1630169994/hereads-logo_r2fecj.jpg'
					: img;

			this.setState({
				id,
				img: devoImage,
				passages,
				summary,
				title,
				gender,
				book,
				mainBodyChanged: true,
				bookmark: false,
			});
		}
	}

	//---------- render FUNCTIONS ----------//

	renderPassages() {
		const { passages, esvPassage } = this.state;
		if (passages.length < 1) return;

		const passagesArray = this.splitPassages(passages);
		if (esvPassage.length !== passagesArray.length) return;

		let esvSortMatch = esvPassage.sort(function (a, b) {
			return (
				passagesArray.indexOf(a.passage) - passagesArray.indexOf(b.passage)
			);
		});

		//---------- CATCH undefined ESV API returns ----------//
		let newEsvData = esvSortMatch.filter((ele, i) => {
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
			let eachText = each.text.split('\n').map((item, j) => {
				//---------- itemCount.push STORES each item into itemCount ----------//
				itemCount.push(item.trim());

				//---------- checking if prevItem !== current item ----------//
				if (itemCount[j - 1] !== item.trim()) {
					return (
						<p key={'bible-text' + j}>
							{item}
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
	}

	renderSummary() {
		const eleCount = [];

		return this.state.summary.split('\n').map((ele, i) => {
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
	}

	findMainBodyIndex() {
		const { mainBodyDevo, devoBook } = this.props;
		return devoBook.findIndex((devo) => devo.id === mainBodyDevo.id);
	}

	toggleMainBody(type) {
		const { devoBook, fetchDevo } = this.props;
		const mainBodyIndex = this.findMainBodyIndex();

		switch (type) {
			case 'previous':
				if (mainBodyIndex === 0) return;
				return fetchDevo(devoBook[mainBodyIndex - 1].id);

			case 'next':
				if (mainBodyIndex === devoBook.length - 1) return;
				return fetchDevo(devoBook[mainBodyIndex + 1].id);

			default:
				return;
		}
	}

	toggleBookmark() {
		const { bookmark, id, renderDay, gender, book, bookmarkId } = this.state;
		const { currentUser, createBookmark, deleteBookmark } = this.props;

		let bookmarkData = {
			gender,
			book,
			user_id: currentUser.id,
			devo_id: id,
			render_day: renderDay,
		};

		if (bookmark) {
			deleteBookmark(bookmarkId);
			this.localStorageFunc('removeCurrentPage');
		} else {
			createBookmark(bookmarkData);
		}

		this.setState({ bookmark: !bookmark });
	}

	toggleAudio() {
		const { esvPassage } = this.state;
		const passageSplit = esvPassage[0].passage.split(' ');

		const checkForNumber = (data) => {
			return data.match(/^([1-9]|[1-8][0-9]|9[0-9]|1[0-4][0-9]|150)$/g);
		};

		let book = passageSplit[0];
		let chapter = passageSplit[passageSplit.length - 1].split(':')[0];

		if (checkForNumber(book)) {
			book = `${book} ${passageSplit[1]}`;
		} else if (book === 'Song') {
			book = 'Song of Songs';
		}

		let bookName = maxMcLeanBooks[regBibleTitles.indexOf(book)];
		let theURL = `https://www.biblegateway.com/audio/mclean/esv/${bookName}.${chapter}`;
		let winName = 'Max McLean Audio';
		let winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
            width=330,height=460,left=100,top=100`;

		bookName !== undefined && window.open(theURL, winName, winParams);
	}

	render() {
		if (this.isMainBodyDevoNull() && !this.localStorageFunc('getCurrentPage'))
			return <div></div>;

		this.state.bookmark &&
			this.isValidNumber(this.state.bookmarkId) &&
			this.localStorageFunc('setCurrentPage');

		return (
			<div className='middle-container'>
				<div className='devo-main-title-wrapper'>
					<div className='devo-main-title'>
						<span className='devo-main-day'>Day {this.state.renderDay}:</span>
						<span>{this.state.title}</span>
					</div>
					<div className='devo-main-title-icons'>
						<i
							id='previous-arrow'
							className='fas fa-caret-left icons'
							onClick={() => this.toggleMainBody('previous')}
						></i>
						<i
							id='next-arrow'
							className='fas fa-caret-right icons'
							onClick={() => this.toggleMainBody('next')}
						></i>
						<i
							id='max-mclean-audio'
							className='fa fa-volume-up icons'
							onClick={() => this.toggleAudio()}
							aria-hidden='true'
						></i>
						<i
							id='bookmark'
							className={
								this.state.bookmark
									? 'fa fa-bookmark icons'
									: 'fa fa-bookmark-o icons'
							}
							onClick={() => this.toggleBookmark()}
							aria-hidden='true'
						></i>
					</div>
				</div>
				<div className='devo-main-container' ref={this.myRef}>
					<div className='form-or-separator-mainbody-passages'>
						<hr />
					</div>
					<div className='devo-main-passages'>
						<span>{this.renderPassages()}</span>
					</div>
					<div className='form-or-separator-mainbody-summary'>
						<hr />
					</div>
					<div className='devo-main-body'>
						<br />
						<div>{this.renderSummary()}</div>
						<br />
					</div>
					<div className='form-or-separator-mainbody-image'>
						<hr />
					</div>
					<div className='devo-main-image'>
						<img src={this.state.img} />
					</div>
				</div>
			</div>
		);
	}
}

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
});

export default connect(mapState, mapDispatch)(MainBody);
