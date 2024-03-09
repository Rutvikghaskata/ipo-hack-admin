import ReactPaginate from "react-paginate";

import "./pagination.scss";

const Pagination = ({
  handlePageClick,
  pageCount,
  pageLimit = 3,
  nextLabel = "next >",
  previousLabel = "< previous",
}) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={nextLabel}
      onPageChange={handlePageClick}
      pageRangeDisplayed={pageLimit}
      pageCount={pageCount}
      previousLabel={previousLabel}
      renderOnZeroPageCount={null}
      className="pagination"
      pageClassName="page-no"
    />
  );
};

export default Pagination;
