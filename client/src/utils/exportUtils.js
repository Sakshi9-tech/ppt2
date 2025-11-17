import pptxgen from 'pptxgenjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const exportToPPTX = (slides, filename = 'presentation.pptx') => {
  const pptx = new pptxgen();
  
  slides.forEach((slide, index) => {
    const pptxSlide = pptx.addSlide();
    
    // Set background
    if (slide.background && slide.background !== '#ffffff') {
      pptxSlide.background = { color: slide.background.replace('#', '') };
    }
    
    // Add title
    if (slide.title && slide.title !== 'Click to add title') {
      const titleText = slide.title.replace(/<[^>]*>/g, ''); // Strip HTML
      pptxSlide.addText(titleText, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 24,
        bold: true,
        color: slide.textColor?.replace('#', '') || '000000'
      });
    }
    
    // Add content
    if (slide.content && slide.content !== 'Click to add content') {
      const contentText = slide.content.replace(/<[^>]*>/g, ''); // Strip HTML
      pptxSlide.addText(contentText, {
        x: 0.5,
        y: 2,
        w: 9,
        h: 4,
        fontSize: 16,
        color: slide.textColor?.replace('#', '') || '000000'
      });
    }
    
    // Add elements
    slide.elements?.forEach(element => {
      if (element.type === 'textbox') {
        const text = element.content.replace(/<[^>]*>/g, '');
        pptxSlide.addText(text, {
          x: element.x / 100,
          y: element.y / 100,
          w: element.width / 100,
          h: element.height / 100,
          fontSize: element.fontSize || 16,
          fontFace: element.fontFamily || 'Arial',
          color: element.color?.replace('#', '') || '000000'
        });
      } else if (element.type === 'shape') {
        const shapeType = element.shapeType === 'circle' ? pptx.ShapeType.oval : pptx.ShapeType.rect;
        pptxSlide.addShape(shapeType, {
          x: element.x / 100,
          y: element.y / 100,
          w: element.width / 100,
          h: element.height / 100,
          fill: element.fill?.replace('#', '') || 'FFFFFF',
          line: { color: element.stroke?.replace('#', '') || '000000', width: element.strokeWidth || 1 }
        });
      } else if (element.type === 'image' && element.src) {
        pptxSlide.addImage({
          data: element.src,
          x: element.x / 100,
          y: element.y / 100,
          w: element.width / 100,
          h: element.height / 100
        });
      }
    });
  });
  
  pptx.writeFile({ fileName: filename });
};

export const exportToPDF = async (slides, filename = 'presentation.pdf') => {
  const pdf = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  for (let i = 0; i < slides.length; i++) {
    if (i > 0) pdf.addPage();
    
    const slide = slides[i];
    
    // Set background color
    if (slide.background && slide.background !== '#ffffff') {
      const rgb = hexToRgb(slide.background);
      if (rgb) {
        pdf.setFillColor(rgb.r, rgb.g, rgb.b);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      }
    }
    
    // Add title
    if (slide.title && slide.title !== 'Click to add title') {
      const titleText = slide.title.replace(/<[^>]*>/g, '');
      pdf.setFontSize(24);
      pdf.setFont(undefined, 'bold');
      const textColor = hexToRgb(slide.textColor || '#000000');
      if (textColor) pdf.setTextColor(textColor.r, textColor.g, textColor.b);
      pdf.text(titleText, 20, 30);
    }
    
    // Add content
    if (slide.content && slide.content !== 'Click to add content') {
      const contentText = slide.content.replace(/<[^>]*>/g, '');
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'normal');
      const lines = pdf.splitTextToSize(contentText, pageWidth - 40);
      pdf.text(lines, 20, 50);
    }
    
    // Add elements
    slide.elements?.forEach(element => {
      if (element.type === 'textbox') {
        const text = element.content.replace(/<[^>]*>/g, '');
        pdf.setFontSize(element.fontSize || 16);
        const textColor = hexToRgb(element.color || '#000000');
        if (textColor) pdf.setTextColor(textColor.r, textColor.g, textColor.b);
        pdf.text(text, (element.x / 800) * pageWidth, (element.y / 600) * pageHeight);
      }
    });
    
    // Add slide number
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`${i + 1}`, pageWidth - 20, pageHeight - 10);
  }
  
  pdf.save(filename);
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const exportSlideAsImage = async (slideElement, format = 'png', filename = 'slide') => {
  if (!slideElement) return;
  
  try {
    const canvas = await html2canvas(slideElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    });
    
    canvas.toBlob((blob) => {
      saveAs(blob, `${filename}.${format}`);
    }, `image/${format}`);
  } catch (error) {
    console.error('Error exporting slide:', error);
  }
};

export const exportToJSON = (slides, filename = 'presentation.json') => {
  const data = {
    version: '1.0',
    created: new Date().toISOString(),
    slides: slides
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, filename);
};

export const exportToHTML = (slides, filename = 'presentation.html') => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EtherXPPT Presentation</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f0f0f0; }
        .slide { width: 800px; height: 600px; margin: 20px auto; background: white; border: 1px solid #ccc; position: relative; page-break-after: always; }
        .slide-title { position: absolute; top: 32px; left: 32px; right: 32px; font-size: 32px; font-weight: bold; text-align: center; }
        .slide-content { position: absolute; top: 96px; left: 32px; right: 32px; bottom: 32px; font-size: 18px; }
        .element { position: absolute; }
        @media print { body { background: white; } .slide { margin: 0; border: none; } }
    </style>
</head>
<body>
${slides.map((slide, index) => `
    <div class="slide" style="background-color: ${slide.background || '#ffffff'}; color: ${slide.textColor || '#000000'}">
        ${slide.title && slide.title !== 'Click to add title' ? `<div class="slide-title">${slide.title}</div>` : ''}
        ${slide.content && slide.content !== 'Click to add content' ? `<div class="slide-content">${slide.content}</div>` : ''}
        ${(slide.elements || []).map(element => {
          if (element.type === 'textbox') {
            return `<div class="element" style="left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px; font-size: ${element.fontSize}px; font-family: ${element.fontFamily}; color: ${element.color}; background-color: ${element.backgroundColor};">${element.content}</div>`;
          } else if (element.type === 'image') {
            return `<img class="element" src="${element.src}" style="left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px;" alt="${element.alt}" />`;
          }
          return '';
        }).join('')}
    </div>
`).join('')}
</body>
</html>`;
  
  const blob = new Blob([html], { type: 'text/html' });
  saveAs(blob, filename);
};

export const exportAllSlides = async (slides, format = 'png') => {
  const zip = new JSZip();
  const slideElements = document.querySelectorAll('.slide-canvas');
  
  for (let i = 0; i < slideElements.length; i++) {
    try {
      const canvas = await html2canvas(slideElements[i], {
        backgroundColor: slides[i]?.background || '#ffffff',
        scale: 2,
        useCORS: true
      });
      
      const dataUrl = canvas.toDataURL(`image/${format}`);
      const base64Data = dataUrl.split(',')[1];
      zip.file(`slide-${i + 1}.${format}`, base64Data, { base64: true });
    } catch (error) {
      console.error(`Error exporting slide ${i + 1}:`, error);
    }
  }
  
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'slides.zip');
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.slides && Array.isArray(data.slides)) {
          resolve(data.slides);
        } else {
          reject(new Error('Invalid presentation format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const importFromPPTX = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      // Basic PPTX parsing - extract slide content
      const slides = [];
      const slideFiles = Object.keys(contents.files).filter(name => 
        name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
      );
      
      for (const slideFile of slideFiles) {
        const slideXml = await contents.files[slideFile].async('text');
        const slide = parsePPTXSlide(slideXml);
        slides.push(slide);
      }
      
      resolve(slides.length > 0 ? slides : [{
        id: Date.now(),
        title: 'Imported Slide',
        content: 'Content imported from PowerPoint',
        background: '#ffffff',
        textColor: '#000000',
        layout: 'title-content',
        elements: []
      }]);
    } catch (error) {
      reject(error);
    }
  });
};

const parsePPTXSlide = (xml) => {
  // Basic XML parsing for PPTX content
  const titleMatch = xml.match(/<a:t>([^<]+)<\/a:t>/);
  const title = titleMatch ? titleMatch[1] : 'Imported Slide';
  
  return {
    id: Date.now() + Math.random(),
    title,
    content: 'Content imported from PowerPoint',
    background: '#ffffff',
    textColor: '#000000',
    layout: 'title-content',
    elements: []
  };
};

export const printPresentation = () => {
  window.print();
};