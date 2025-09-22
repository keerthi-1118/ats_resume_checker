// src/utils/resumePdfGenerator.js
import html2pdf from 'html2pdf.js';

const generateResumePdf = (element, filename = 'resume.pdf') => {
    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true);
    
    // Remove any conflicting classes and add clean PDF styles
    clonedElement.className = 'resume-preview-pdf';
    clonedElement.style.cssText = `
        background: white !important;
        color: #333 !important;
        font-family: 'Times New Roman', serif !important;
        line-height: 1.4 !important;
        padding: 40px !important;
        margin: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: none !important;
        width: 100% !important;
        height: auto !important;
        transform: none !important;
        animation: none !important;
    `;
    
    // Remove any dark theme elements
    const darkElements = clonedElement.querySelectorAll('.builder-header, .tab-navigation, .form-section-container');
    darkElements.forEach(el => el.remove());
    
    const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5], // Top, Left, Bottom, Right margin in inches
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            logging: false, 
            dpi: 192, 
            letterRendering: true,
            useCORS: true,
            backgroundColor: '#ffffff'
        },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(clonedElement).save();
};

export default generateResumePdf;