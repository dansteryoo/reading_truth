import React, { useState, useEffect, createRef } from 'react';
import SideNavItem from './sidenav_item';
import { allBookTitles, allBookTitlesFormat } from '../../helpers/bookTitles';
import { setPayload } from '../../helpers/helperFunctions';
import { connect } from 'react-redux';
import { fetchDevo, fetchDevoBook } from '../../actions/devo_actions';
import { sortDevoBook } from '../../helpers/helperFunctions';

/******************************
 *      SideNav Component     *
 ******************************/

const SideNav = ({ currentUser, fetchDevoBook, fetchDevo, devoBook }) => {
	const [book, setBook] = useState('');
	const myRef = createRef();
	const currentUserBookmark = currentUser.bookmark;

	useEffect(() => {
		handleMounting();
	}, []);

	useEffect(() => {
		updateBookTitle();
	}, [devoBook]);

	/******************************
	 *       bookmarkIsBlank      *
	 ******************************/

	const bookmarkIsBlank = (bookmark) => {
		return bookmark == (undefined || null) || Object.values(bookmark).length < 1;
	};

	/******************************
	 *       handleMounting       *
	 ******************************/

	const handleMounting = async () => {
		const userId = JSON.stringify(currentUser.id);
		const currentPage = JSON.parse(localStorage.getItem(userId));

		if (currentPage) {
			setBook(currentPage.book);
			return fetchDevoBook(setPayload(currentPage));
		}
		if (!bookmarkIsBlank(currentUser.bookmark)) {
			setBook(currentUserBookmark.book);
			return fetchDevoBook(setPayload(currentUserBookmark));
		}
	};

	/******************************
	 *       updateBookTitle      *
	 ******************************/

	const updateBookTitle = () => {
		if (devoBook.length > 0) {
			setBook(devoBook[0].book);
			devoBook[0].book !== book && myRef.current.scrollTo(0, 0);
		}
	};

	/******************************
	 *       renderBookTitle      *
	 ******************************/

	const renderBookTitle = () => {
		const devoBookTitle = allBookTitlesFormat[book];
		const devoBookTitleRender = allBookTitles[allBookTitles.indexOf(book)];
		return devoBookTitleRender || devoBookTitle;
	};

	/******************************
	 *           render           *
	 ******************************/

	return (
		<div className='left-container'>
			<div className='sidenav-title'>
				<span>{renderBookTitle()}</span>
			</div>
			<div className='sidenav-container' ref={myRef}>
				<ul className='sidenav-ul'>
					{devoBook.map((dailyDevo, i) => (
						<SideNavItem days={i} dailyDevo={dailyDevo} fetchDevo={fetchDevo} key={dailyDevo.id} />
					))}
				</ul>
			</div>
		</div>
	);
};

/******************************
 *      mapStateToProps       *
 ******************************/

const mapStateToProps = ({ session, users, devos }) => {
	const devoBook = devos.devoBook ? Object.values(devos.devoBook) : [];

	return {
		currentUser: users[session.id],
		devoBook: sortDevoBook(devoBook),
	};
};

/******************************
 *     mapDispatchToProps     *
 ******************************/

const mapDispatchToProps = (dispatch) => ({
	fetchDevo: (devoId) => dispatch(fetchDevo(devoId)),
	fetchDevoBook: (book) => dispatch(fetchDevoBook(book)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
