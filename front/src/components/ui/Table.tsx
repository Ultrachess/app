import React from "react";

const Table = ({ columns, rows }) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col min-h-32 max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm flex-grow">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900"
                >
                  {column}
                </th>
              ))}
              <th className="px-2 py-2"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="whitespace-nowrap px-2 py-3 text-gray-700"
                  >
                    {cell}
                  </td>
                ))}
                {/* <td className="whitespace-nowrap px-4 py-2">
                  <a
                    href="#"
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    View
                  </a>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
