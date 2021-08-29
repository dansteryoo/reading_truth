import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { closeModal, openModal } from '../../actions/modal_actions';
import { fetchDevoIndex, clearDevoState, fetchDevoBook } from '../../actions/devo_actions'

import {
	bibleBooksForIndexing,
	OTbooks,
	NTbooks,
	themeBooks,
} from '../../helpers/bookTitles';
import {
	setPayload,
	sortTitles,
	sortAlphabetically,
	createTitlePayload,
} from '../../helpers/helperFunctions';

const klassName = {
	she: {
		div: 'categories-title-she',
		section: 'categories-section-she',
	},
	he: {
		div: 'categories-title-he',
		section: 'categories-section-he',
	},
};

const Categories = ({
	fetchDevoIndex,
	fetchDevoBook,
	closeModal,
	sheDevoIndex,
	heDevoIndex,
}) => {
	useEffect(() => {
		fetchDevoIndex();
	}, []);

	/***********************************
	 *           handleClick           *
	 ***********************************/

	const handleClick = (devoPayload, e) => {
		e.preventDefault();
		fetchDevoBook(setPayload(devoPayload));
		return closeModal();
	};

	/***********************************
	 *       renderCategoryList       *
	 ***********************************/

	const renderCategoryList = ({ fetchBookPayload, title, i }) => {
		return (
			<li key={`${title + i}`} className='category-li'>
				<span
					className='category-title'
					onClick={(e) => handleClick(fetchBookPayload, e)}
				>
					{fetchBookPayload.book}
				</span>
			</li>
		);
	};

	/***********************************
	 *           renderBooks           *
	 ***********************************/

	const renderBooks = (gender, type) => {
		const klass = gender === 'she' ? 'she-category-ul' : 'he-category-ul';
		const devoIndex = gender === 'she' ? sheDevoIndex : heDevoIndex;
		const bookType = type === 'ot' ? OTbooks : NTbooks;
		return (
			<ul className={klass}>
				{type === 'ot' || type === 'nt'
					? sortTitles(devoIndex, bibleBooksForIndexing).map((title, i) => {
							const fetchBookPayload = createTitlePayload(bookType, title);
							return renderCategoryList({ fetchBookPayload, title, i });
					  })
					: sortAlphabetically(devoIndex).map((title, i) => {
							const fetchBookPayload = createTitlePayload(themeBooks, title);
							return renderCategoryList({ fetchBookPayload, title, i });
					  })}
			</ul>
		);
	};

	/***********************************
	 *           renderBooks           *
	 ***********************************/

	const renderSections = (gender) => {
		const klass = gender === 'she' ? klassName.she : klassName.he;
		return (
			<section className={klass.section}>
				<div className={klass.div}>
					<span>Old Testament</span>
				</div>
				<div className='categories-OT'>{renderBooks(gender, 'ot')}</div>
				<div className={klass.div}>
					<span>New Testament</span>
				</div>
				<div className='categories-NT'>{renderBooks(gender, 'nt')}</div>
				<div className={klass.div}>
					<span>Themes</span>
				</div>
				<div className='categories-Other'>{renderBooks(gender)}</div>
			</section>
		);
	};

	/***********************************
	 *              render             *
	 ***********************************/

	return (
		<div className='categories-page-container'>
			<div className='form-closing-x' onClick={closeModal}>
				&#10005;
			</div>
			{renderSections('she')}
			<div className='form-or-separator-categories'>
				<hr />
			</div>
			{renderSections('he')}
		</div>
	);
};

const mapState = ({ devos, modal, users, session, errors }) => {
	const deleteMainBodyDevo = devos.mainBodyDevo
		? Object.values(devos).filter((ele) => ele.id === undefined)
		: Object.values(devos);

	const allDevosIdxFiltered = deleteMainBodyDevo.filter(
		(ele) => ele.gender === 'HE' || ele.gender === 'SHE'
	);

	const allDevosIdx = allDevosIdxFiltered.map((each) => ({
		gender: each.gender,
		book: each.book.toLowerCase(),
	}));

	const heDevoIndex = modal.data
		? allDevosIdx.filter(
				(ele) => ele.gender === 'HE' && ele.book.match(modal.data)
		  )
		: allDevosIdx.filter((ele) => ele.gender === 'HE');

	const sheDevoIndex = modal.data
		? allDevosIdx.filter(
				(ele) => ele.gender === 'SHE' && ele.book.match(modal.data)
		  )
		: allDevosIdx.filter((ele) => ele.gender === 'SHE');

	const devoBook = devos.devoBook ? Object.values(devos.devoBook) : [];

	return {
		currentUser: users[session.id],
		errors,
		heDevoIndex,
		sheDevoIndex,
		devoBook,
	};
};

const mapDispatch = (dispatch) => ({
	closeModal: () => dispatch(closeModal()),
	openModal: (modal, book) => dispatch(openModal(modal, book)),
	fetchDevoIndex: () => dispatch(fetchDevoIndex()),
	clearDevoState: () => dispatch(clearDevoState()),
	fetchDevoBook: (book) => dispatch(fetchDevoBook(book)),
});


export default connect(mapState, mapDispatch)(Categories);
