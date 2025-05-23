import { PaginationProps } from "../../types/component.types";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 0) return null;

  return (
    <div className="flex justify-center items-center mt-6 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F2942] transition-colors duration-150"
      >
        Previous
      </button>
      <div className="flex mx-4 space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-base font-medium transition-colors duration-150 ${
              currentPage === page
                ? "bg-[#0F2942] text-white shadow-md"
                : "text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F2942] transition-colors duration-150"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
