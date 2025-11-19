import React, { useState, useRef, useEffect } from 'react';
import { usePresentation } from '../contexts/PresentationContext';
import ChartComponent from './ChartComponent';
import TableComponent from './TableComponent';

const SlideEditor = () => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const [selectedElement, setSelectedElement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showChartModal, setShowChartModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  
  const slide = slides[currentSlide] || {};

  const handleTitleEdit = (e) => {
    updateSlide(currentSlide, { title: e.target.innerHTML });
  };

  const handleContentEdit = (e) => {
    updateSlide(currentSlide, { content: e.target.innerHTML });
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const addTextBox = () => {
    const newElement = {
      id: Date.now(),
      type: 'textbox',
      content: 'New text box',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#000000',
      backgroundColor: 'transparent'
    };
    
    const elements = slide.elements || [];
    updateSlide(currentSlide, { elements: [...elements, newElement] });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newElement = {
          id: Date.now(),
          type: 'image',
          src: e.target.result,
          x: 100,
          y: 200,
          width: 200,
          height: 150,
          alt: file.name
        };
        
        const elements = slide.elements || [];
        updateSlide(currentSlide, { elements: [...elements, newElement] });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateElement = (elementId, updates) => {
    const elements = slide.elements || [];
    const updatedElements = elements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    updateSlide(currentSlide, { elements: updatedElements });
  };

  const deleteElement = (elementId) => {
    const elements = slide.elements || [];
    const filteredElements = elements.filter(el => el.id !== elementId);
    updateSlide(currentSlide, { elements: filteredElements });
    setSelectedElement(null);
  };

  const handleMouseDown = (e, elementId) => {
    e.preventDefault();
    setSelectedElement(elementId);
    setIsDragging(true);
    
    const element = (slide.elements || []).find(el => el.id === elementId);
    if (element) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && selectedElement) {
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      
      updateElement(selectedElement, { x: Math.max(0, x), y: Math.max(0, y) });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex-1 p-6">
      {/* Modern Formatting Toolbar - now uses themed panel styles */}
      <div className="mb-6 panel">
        <div className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Text Formatting Group */}
            <div className="flex items-center gap-1 px-3 py-1 rounded-lg">
              <button
                onClick={() => formatText('bold')}
                className="toolbar-btn"
                title="Bold (Ctrl+B)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
                </svg>
              </button>
              <button
                onClick={() => formatText('italic')}
                className="toolbar-btn"
                title="Italic (Ctrl+I)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/>
                </svg>
              </button>
              <button
                onClick={() => formatText('underline')}
                className="toolbar-btn"
                title="Underline (Ctrl+U)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
                </svg>
              </button>
            </div>
            
            <div className="w-px h-8 bg-neutral-300 dark:bg-neutral-700"></div>
            
            {/* Font Size and Color */}
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => formatText('fontSize', e.target.value)}
                className="form-select text-sm min-w-20"
                defaultValue="16"
              >
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
                <option value="24">24px</option>
                <option value="32">32px</option>
                <option value="48">48px</option>
              </select>
              
              <div className="relative">
                <input
                  type="color"
                  onChange={(e) => formatText('foreColor', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer form-input"
                  title="Text Color"
                />
              </div>
            </div>
            
            <div className="w-px h-8 bg-neutral-300 dark:bg-neutral-700"></div>
            
            {/* Insert Elements */}
            <div className="flex items-center gap-2">
              <button
                onClick={addTextBox}
                className="btn-secondary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Text Box
              </button>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="btn-secondary flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Image
              </label>
              
              <button
                onClick={() => setShowChartModal(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Chart
              </button>
              
              <button
                onClick={() => setShowTableModal(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1z" />
                </svg>
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Slide Canvas */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Canvas Container with Modern Shadow */}
          <div 
            className="slide-canvas relative overflow-hidden"
            style={{ 
              width: '900px', 
              height: '675px', 
              backgroundColor: slide.background || '#ffffff',
              aspectRatio: '16/12'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}></div>
            {/* Modern Title Area */}
            <div
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning={true}
              onBlur={handleTitleEdit}
              onFocus={() => setIsEditing(true)}
              className="absolute top-12 left-12 right-12 text-4xl font-bold text-center outline-none min-h-[60px] p-4 rounded-xl transition-all duration-200 bg-transparent"
              style={{ color: slide.textColor || '#1f2937' }}
              dangerouslySetInnerHTML={{ __html: slide.title || '<span style="color:rgba(255,255,255,0.45)">Click to add title</span>' }}
            />

            {/* Modern Content Area */}
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning={true}
              onBlur={handleContentEdit}
              onFocus={() => setIsEditing(true)}
              className="absolute top-32 left-12 right-12 bottom-12 text-lg outline-none p-6 rounded-xl transition-all duration-200 bg-transparent"
              style={{ color: slide.textColor || '#374151' }}
              dangerouslySetInnerHTML={{ __html: slide.content || '<span style="color:rgba(255,255,255,0.45)">Click to add content</span>' }}
            />

            {/* Modern Dynamic Elements */}
            {(slide.elements || []).map((element) => (
              <div
                key={element.id}
                className={`slide-element ${
                  selectedElement === element.id ? 'selected' : ''
                }`}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                fontSize: element.fontSize,
                fontFamily: element.fontFamily,
                color: element.color,
                backgroundColor: element.backgroundColor
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
              onClick={() => setSelectedElement(element.id)}
            >
              {element.type === 'textbox' && (
                <div
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) => updateElement(element.id, { content: e.target.innerHTML })}
                  className="w-full h-full outline-none p-1"
                  dangerouslySetInnerHTML={{ __html: element.content }}
                />
              )}
              
              {element.type === 'image' && (
                <img
                  src={element.src}
                  alt={element.alt}
                  className="w-full h-full object-cover rounded"
                  draggable={false}
                />
              )}
              
              {element.type === 'shape' && (
                <div className="w-full h-full">
                  {element.shapeType === 'rectangle' && (
                    <div
                      className="w-full h-full rounded"
                      style={{
                        backgroundColor: element.fill,
                        border: `${element.strokeWidth}px solid ${element.stroke}`
                      }}
                    />
                  )}
                  {element.shapeType === 'circle' && (
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        backgroundColor: element.fill,
                        border: `${element.strokeWidth}px solid ${element.stroke}`
                      }}
                    />
                  )}
                  {element.shapeType === 'triangle' && (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl"
                      style={{ color: element.fill }}
                    >
                      🔺
                    </div>
                  )}
                </div>
              )}
              
              {element.type === 'icon' && (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ fontSize: element.fontSize }}
                >
                  {element.content}
                </div>
              )}
              
              {element.type === 'chart' && (
                <div className="w-full h-full p-2">
                  <div className="text-xs font-medium mb-1">{element.title}</div>
                  <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                    📊 {element.chartType.toUpperCase()} Chart
                  </div>
                </div>
              )}
              
              {element.type === 'table' && (
                <div className="w-full h-full overflow-hidden">
                  <table className="w-full h-full text-xs border-collapse">
                    <tbody>
                      {element.data.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className="border border-gray-300 p-1 truncate">
                              {cell || `${i + 1},${j + 1}`}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
                {selectedElement === element.id && (
                  <>
                    {/* Modern Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteElement(element.id);
                      }}
                      className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    {/* Resize Handles */}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-500 rounded-full cursor-se-resize"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full cursor-ne-resize"></div>
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary-500 rounded-full cursor-nw-resize"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary-500 rounded-full cursor-sw-resize"></div>
                  </>
                )}
              </div>
            ))}
          </div>
          
          {/* Canvas Info */}
          <div className="absolute -bottom-8 left-0 text-xs text-neutral-500 dark:text-neutral-400">
            16:12 Aspect Ratio • 900×675px
          </div>
        </div>
      </div>

      {/* Modern Element Properties Panel */}
      {selectedElement && (
        <div className="mt-6 panel animate-fade-in">
          <div className="panel-header">
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Element Properties</h4>
            <button
              onClick={() => setSelectedElement(null)}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Font Size</label>
              <input
                type="number"
                placeholder="Font Size"
                onChange={(e) => updateElement(selectedElement, { fontSize: parseInt(e.target.value) })}
                className="form-input"
                min="8"
                max="72"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Font Family</label>
              <select
                onChange={(e) => updateElement(selectedElement, { fontFamily: e.target.value })}
                className="form-select"
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Text Color</label>
              <div className="relative">
                <input
                  type="color"
                  onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
                  className="w-full h-10 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer"
                  title="Text Color"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Background</label>
              <div className="relative">
                <input
                  type="color"
                  onChange={(e) => updateElement(selectedElement, { backgroundColor: e.target.value })}
                  className="w-full h-10 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer"
                  title="Background Color"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modern Modals */}
      {showChartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="animate-zoom-in">
            <ChartComponent onClose={() => setShowChartModal(false)} />
          </div>
        </div>
      )}
      {showTableModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="animate-zoom-in">
            <TableComponent onClose={() => setShowTableModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideEditor;