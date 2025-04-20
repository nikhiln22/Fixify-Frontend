import { TableWithPaginationProps } from "../../types/component.types";

const TableWithPagination = <T extends object>({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: TableWithPaginationProps<T>) => {
  return (
    <div className="overflow-x-auto w-full">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-300"></div>
          <span className="ml-3 text-gray-600 font-medium">Loading...</span>
        </div>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
            <thead className="bg-[#0F2942]">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={String(col.key)}
                    className={`px-6 py-3 text-center border-b border-r border-gray-200 text-white font-medium tracking-wider uppercase text-base ${
                      index === 0 ? "rounded-tl-xl" : ""
                    } ${
                      index === columns.length - 1 ? "rounded-tr-xl" : ""
                    }`}
                    style={{ width: `${100 / columns.length}%` }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-8 text-gray-500 bg-gray-50"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z"></path>
                      </svg>
                      <p className="mt-2 text-gray-600">No data found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className="hover:bg-gray-100 transition-colors duration-150 ease-in-out"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-6 py-4 border-b border-r border-gray-200 text-base text-gray-700"
                      >
                        {col.render
                          ? col.render(row, (currentPage - 1) * data.length + rowIndex)
                          : String(row[col.key as keyof T])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalPages > 0 && (
            <div className="flex justify-center items-center mt-6 mb-4">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F2942] transition-colors duration-150"
              >
                Previous
              </button>
              <div className="flex mx-4 space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  )
                )}
              </div>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F2942] transition-colors duration-150"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TableWithPagination;