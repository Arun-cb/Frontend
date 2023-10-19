/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------
  
   30-Sep-2022  Arun R      Initial Version             V1
   
   ** This Page is to define Reusable Pagintion Component   **
   
============================================================================================================================================================*/

import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from './usePagination';
import '../Assets/CSS/pagination.css'

const FnPagination = props => {
  
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });


  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const fnOnNext = () => {
    onPageChange(currentPage + 1);
  };

  const fnOnPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul
      className={classnames('pagination-container', { [className]: className })}
    >
      <li
        className={classnames('pagination-item', {
          'd-none': currentPage === 1
        })}
        onClick={fnOnPrevious}
      >
        <div className="arrow left" >   Prev </div>
      </li>
      {paginationRange.map((pageNumber,i) => {
        if (pageNumber === DOTS) {
          return <li key={i} className="pagination-item dots">&#8230;</li>;
        }

        return (
          <li key={i}
            className={classnames('pagination-item', {
              selected: pageNumber === currentPage
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={classnames('pagination-item', {
          'd-none': currentPage === lastPage
        })}
        onClick={fnOnNext}
      >
        <div className="arrow right" > Next </div>
      </li>
    </ul>
  );
};

export default FnPagination;