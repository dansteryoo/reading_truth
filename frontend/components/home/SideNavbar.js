import React, { useState, useEffect, createRef } from 'react';
import SideNavbarItem from './SideNavbarItem';
import { setPayload } from '../../helpers/helperFunctions';
import { connect } from 'react-redux';
import { fetchDevo, fetchDevoBook } from '../../actions/devo_actions';
import { sortDevoBook } from '../../helpers/helperFunctions';

/******************************
 *      SideNavbar Component     *
 ******************************/

const SideNavbar = ({ currentUser, fetchDevoBook, fetchDevo, devoBook }) => {
	const [book, setBook] = useState('');
	const myRef = createRef();
	const currentUserBookmark = currentUser.bookmark;

	useEffect(() => {
		handleMounting();
	}, []);

	useEffect(() => {
		if (devoBook.length > 0) {
			setBook(devoBook[0].book);
			devoBook[0].book !== book && myRef.current.scrollTo(0, 0);
		}
	}, [devoBook]);

	/******************************
	 *       bookmarkIsBlank      *
	 ******************************/

	const bookmarkIsBlank = (bookmark) => {
		return (
			bookmark == (undefined || null) || Object.values(bookmark).length < 1
		);
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
	 *           render           *
	 ******************************/

	return (
		<div className='left-container'>
			<div className='sidenav-title'>
				<span>{book}</span>
			</div>
			<div className='sidenav-container' ref={myRef}>
				<ul className='sidenav-ul'>
					{devoBook.map((dailyDevo, i) => (
						<SideNavbarItem
							days={i}
							dailyDevo={dailyDevo}
							fetchDevo={fetchDevo}
							key={dailyDevo.id}
						/>
					))}
				</ul>
			</div>
		</div>
	);
};

/******************************
 *      mapState       *
 ******************************/

const mapState = ({ session, users, devos }) => {
	const devoBook = devos.devoBook ? Object.values(devos.devoBook) : [];

	return {
		currentUser: users[session.id],
		devoBook: sortDevoBook(devoBook),
	};
};

const mapDispatch = (dispatch) => ({
	fetchDevo: (devoId) => dispatch(fetchDevo(devoId)),
	fetchDevoBook: (book) => dispatch(fetchDevoBook(book)),
});

export default connect(mapState, mapDispatch)(SideNavbar);
