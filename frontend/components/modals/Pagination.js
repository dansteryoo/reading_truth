import React from 'react';

/******************************
 *    Pagination Component    *
 ******************************/

const Pagination = ({
  paginate,
  currentPage,
  nextPage,
  prevPage,
  maxPage
}) => {

  const totalBlocks = 5;
  const LEFT_PAGE = 'LEFT';
  const RIGHT_PAGE = 'RIGHT';

  const range = (from, to, step = 1) => {
    let i = from;
    const range = [];

    while (i <= to) {
      range.push(i);
      i += step;
    }

    return range;
  };

  const fetchPageNumbers = () => {
  if (maxPage > totalBlocks) {
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(maxPage - 1, currentPage + 1);

    let pages = range(startPage, endPage);

    const hasLeftSpill = startPage > 2;
    const hasRightSpill = maxPage - endPage > 1;
    const spillOffset = totalBlocks - (pages.length + 1);

    switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case (hasLeftSpill && !hasRightSpill): {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case (!hasLeftSpill && hasRightSpill): {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case (hasLeftSpill && hasRightSpill):
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }
      return [1, ...pages, maxPage];
    }
    return range(1, maxPage);
    }
    
  const pageNumbers = fetchPageNumbers()

  if (maxPage < 2) {
    return <nav className="pagination-nav"></nav>;
  } else {
        return (
          <>
            <nav className="pagination-nav">
              <ul className="pagination">
                {pageNumbers.map((page, index) => {
                  if (page === LEFT_PAGE)
                    return (
                      <li key={index} className="page-item">
                        <a
                          className="page-link"
                          aria-label="Previous"
                          onClick={() => prevPage()}
                        >
                          <span aria-hidden="true">&laquo;</span>
                        </a>
                      </li>
                    );

                  if (page === RIGHT_PAGE)
                    return (
                      <li key={index} className="page-item">
                        <a
                          className="page-link"
                          aria-label="Next"
                          onClick={() => nextPage()}
                        >
                          <span aria-hidden="true">&raquo;</span>
                        </a>
                      </li>
                    );

                  return (
                    <li key={index} className="page-item">
                      <a
                      onClick={() => paginate(page)}
                      className={page === currentPage ? "active-link" : ""}
                      >
                      {page}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </>
        );
  };
};

export default Pagination;
