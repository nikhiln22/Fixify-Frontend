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
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="px-4 py-2 text-left border-b bg-gray-100 text-gray-700 font-semibold"
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
                    className="text-center py-4 text-gray-500"
                  >
                    No data found.
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-4 py-2 border-b text-sm text-gray-800"
                      >
                        {col.render
                          ? col.render(row)
                          : String(row[col.key as keyof T])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TableWithPagination;
