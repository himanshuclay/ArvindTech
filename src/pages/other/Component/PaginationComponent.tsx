import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

interface PaginationComponentProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ currentPage, setCurrentPage, totalPages }) => {
  const getPaginationItems = () => {
    let items: React.ReactNode[] = [];
    let startPage = Math.max(1, currentPage - 1); // Ensure start page is at least 1
    let endPage = Math.min(totalPages, currentPage + 1); // Ensure end page is within total pages

    // Add first page and previous page separator
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-1" />);
      }
    }

    // Add page items dynamically
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          onClick={() => setCurrentPage(i)}
          active={i === currentPage}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Add next page separator and last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-2" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-white min-width-content rounded-5 m-auto py-1 my-2 pagination-rounded">
      <Pagination>
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
        
        {getPaginationItems()}
        
        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
