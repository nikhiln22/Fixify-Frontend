import { TableProps } from "../../types/component.types";
const Table = <T extends object>({
  data,
  columns,
  currentPage,
  pageSize = 5,
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto w-full">
      {
        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <thead className="bg-[#000000]">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={String(col.key)}
                  className={`px-6 py-3 text-center border-b border-r border-gray-200 text-white font-medium tracking-wider uppercase text-base ${
                    index === 0 ? "rounded-tl-xl" : ""
                  } ${index === columns.length - 1 ? "rounded-tr-xl" : ""} ${
                    col.key === "_id" ? "w-16" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          {data.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-500 bg-gray-50"
                >
                  <p className="text-gray-600 font-medium">No data found.</p>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-100 transition-colors duration-150 ease-in-out"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-6 py-4 border-b border-r border-gray-200 text-base text-gray-700 ${
                        col.key === "_id" ? "w-16" : ""
                      }`}
                    >
                      {col.render
                        ? col.render(
                            row,
                            (currentPage - 1) * pageSize + rowIndex,
                          )
                        : String(row[col.key as keyof T])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      }
    </div>
  );
};
export default Table;
