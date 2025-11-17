import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const TableComponent = ({ onClose }) => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [tableData, setTableData] = useState(
    Array(3).fill().map(() => Array(3).fill(''))
  );

  const updateTableSize = (newRows, newCols) => {
    const newData = Array(newRows).fill().map((_, i) => 
      Array(newCols).fill().map((_, j) => 
        tableData[i]?.[j] || ''
      )
    );
    setTableData(newData);
    setRows(newRows);
    setCols(newCols);
  };

  const updateCell = (row, col, value) => {
    const newData = [...tableData];
    newData[row][col] = value;
    setTableData(newData);
  };

  const addTable = () => {
    const newElement = {
      id: Date.now(),
      type: 'table',
      data: tableData,
      rows,
      cols,
      x: 100,
      y: 100,
      width: cols * 100,
      height: rows * 40,
      headerStyle: { backgroundColor: '#3B82F6', color: '#FFFFFF' },
      cellStyle: { border: '1px solid #D1D5DB', padding: '8px' }
    };
    
    const elements = slides[currentSlide].elements || [];
    updateSlide(currentSlide, { elements: [...elements, newElement] });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Insert Table</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rows</label>
              <input
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => updateTableSize(parseInt(e.target.value), cols)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Columns</label>
              <input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => updateTableSize(rows, parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Table Preview</label>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {tableData.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="border border-gray-300 p-1">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => updateCell(i, j, e.target.value)}
                            placeholder={i === 0 ? `Header ${j + 1}` : `Cell ${i + 1},${j + 1}`}
                            className="w-full px-1 py-0.5 text-xs border-none outline-none bg-transparent"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={addTable}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Insert Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;