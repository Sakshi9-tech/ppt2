import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const ChartComponent = ({ onClose }) => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState([
    { label: 'Q1', value: 30 },
    { label: 'Q2', value: 45 },
    { label: 'Q3', value: 60 },
    { label: 'Q4', value: 40 }
  ]);

  const addChart = () => {
    const newElement = {
      id: Date.now(),
      type: 'chart',
      chartType,
      data: chartData,
      x: 100,
      y: 100,
      width: 400,
      height: 300,
      title: 'Chart Title',
      colors: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B']
    };
    
    const elements = slides[currentSlide].elements || [];
    updateSlide(currentSlide, { elements: [...elements, newElement] });
    onClose();
  };

  const updateData = (index, field, value) => {
    const newData = [...chartData];
    newData[index][field] = field === 'value' ? parseFloat(value) || 0 : value;
    setChartData(newData);
  };

  const addDataPoint = () => {
    setChartData([...chartData, { label: `Item ${chartData.length + 1}`, value: 0 }]);
  };

  const removeDataPoint = (index) => {
    setChartData(chartData.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="modal w-96 max-h-[80vh] overflow-y-auto">
        <div className="p-4 modal-header">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium" style={{ color: 'var(--accent-gold)' }}>Insert Chart</h3>
            <button onClick={onClose} className="btn-ghost" aria-label="Close insert chart">✕</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-light)' }}>Chart Type</label>
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value)}
              className="form-select"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="doughnut">Doughnut Chart</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium" style={{ color: 'var(--text-light)' }}>Data Points</label>
              <button 
                onClick={addDataPoint}
                className="btn-secondary"
              >
                + Add
              </button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateData(index, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1 form-input"
                  />
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => updateData(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="form-input"
                    style={{ width: 80 }}
                  />
                  <button
                    onClick={() => removeDataPoint(index)}
                    className="btn-ghost text-red-400"
                    aria-label={`Remove data point ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4" style={{ borderTop: '1px solid rgba(240,165,0,0.06)' }}>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={addChart}
              className="btn-primary"
            >
              Insert Chart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;