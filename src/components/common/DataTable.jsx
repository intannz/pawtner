import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const DataTable = ({ columns, data, onRowClick, pageSize }) => {
  const [page, setPage] = useState(1);
  const pageCount = pageSize ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;
  const currentPage = Math.min(page, pageCount);
  const visibleData = pageSize
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : data;
  return (
    <>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-[#F6F1E9] bg-opacity-50">
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4 text-sm font-semibold text-[#321B16]">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleData.length > 0 ? (
              visibleData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm text-gray-700">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pageSize && data.length > pageSize && (
        <nav className="table-pagination" aria-label="Halaman tabel">
          <span>Menampilkan {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, data.length)} dari {data.length} data</span>
          <div>
            <button type="button" aria-label="Halaman sebelumnya" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><FiChevronLeft /></button>
            <span>Halaman {currentPage} dari {pageCount}</span>
            <button type="button" aria-label="Halaman berikutnya" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}><FiChevronRight /></button>
          </div>
        </nav>
      )}
    </>
  );
};

export default DataTable;