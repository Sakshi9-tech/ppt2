import React, { useState, useRef, useEffect } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const SlideEditor = () => {
  const { slides, currentSlide, updateSlide } = usePresentation();
  const [selectedElement, setSelectedElement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
      {/* Formatting Toolbar */}
      <div className="mb-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => formatText('bold')}
            className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => formatText('italic')}
            className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => formatText('underline')}
            className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          <select
            onChange={(e) => formatText('fontSize', e.target.value)}
            className="px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="12">12px</option>
            <option value="14">14px</option>
            <option value="16" selected>16px</option>
            <option value="18">18px</option>
            <option value="24">24px</option>
            <option value="32">32px</option>
            <option value="48">48px</option>
          </select>
          <input
            type="color"
            onChange={(e) => formatText('foreColor', e.target.value)}
            className="w-8 h-8 border rounded cursor-pointer"
            title="Text Color"
          />
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          <button
            onClick={addTextBox}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Text Box
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
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
          >
            📷 Image
          </label>
        </div>
      </div>

      {/* Slide Canvas */}
      <div className="flex justify-center">
        <div 
          className="slide-canvas relative bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
          style={{ width: '800px', height: '600px', backgroundColor: slide.background || '#ffffff' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Title Area */}
          <div
            ref={titleRef}
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={handleTitleEdit}
            onFocus={() => setIsEditing(true)}
            className="absolute top-8 left-8 right-8 text-3xl font-bold text-center outline-none min-h-[50px] p-2 rounded border-2 border-transparent hover:border-blue-300 focus:border-blue-500"
            style={{ color: slide.textColor || '#000000' }}
            dangerouslySetInnerHTML={{ __html: slide.title || 'Click to add title' }}
          />

          {/* Content Area */}
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={handleContentEdit}
            onFocus={() => setIsEditing(true)}
            className="absolute top-24 left-8 right-8 bottom-8 text-lg outline-none p-4 rounded border-2 border-transparent hover:border-blue-300 focus:border-blue-500"
            style={{ color: slide.textColor || '#000000' }}
            dangerouslySetInnerHTML={{ __html: slide.content || 'Click to add content' }}
          />

          {/* Dynamic Elements */}
          {(slide.elements || []).map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-move border-2 ${
                selectedElement === element.id ? 'border-blue-500' : 'border-transparent hover:border-blue-300'
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
              
              {selectedElement === element.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteElement(element.id);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Element Properties Panel */}
      {selectedElement && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
          <h4 className="text-sm font-medium mb-2">Element Properties</h4>
          <div className="grid grid-cols-4 gap-2">
            <input
              type="number"
              placeholder="Font Size"
              onChange={(e) => updateElement(selectedElement, { fontSize: parseInt(e.target.value) })}
              className="px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <select
              onChange={(e) => updateElement(selectedElement, { fontFamily: e.target.value })}
              className="px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Georgia">Georgia</option>
            </select>
            <input
              type="color"
              onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
              className="w-full h-8 border rounded cursor-pointer"
              title="Text Color"
            />
            <input
              type="color"
              onChange={(e) => updateElement(selectedElement, { backgroundColor: e.target.value })}
              className="w-full h-8 border rounded cursor-pointer"
              title="Background Color"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideEditor;