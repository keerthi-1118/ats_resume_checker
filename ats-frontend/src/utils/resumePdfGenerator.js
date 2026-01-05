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
        font-size: 12pt !important; /* larger base for PDF */
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
    
    // Inject a lightweight stylesheet to scale headings and text for PDF only
    const style = document.createElement('style');
    style.textContent = `
      .resume-preview-pdf .preview-header h1 { font-size: 22pt !important; }
      .resume-preview-pdf .preview-name { font-size: 18pt !important; }
      .resume-preview-pdf .preview-section h2 { font-size: 14pt !important; }
      .resume-preview-pdf .preview-content-section h4 { font-size: 12.5pt !important; }
      /* Contact line: Gmail / LinkedIn / GitHub */
      .resume-preview-pdf .preview-contact { font-size: 11.5pt !important; line-height: 1.5 !important; }
      .resume-preview-pdf .preview-contact p { font-size: 11.5pt !important; }
      .resume-preview-pdf .contact-item { font-size: 11.5pt !important; }
      .resume-preview-pdf .contact-separator { font-size: 11.5pt !important; }
      .resume-preview-pdf .preview-contact a { font-size: 11.5pt !important; color: #0066cc !important; text-decoration: none !important; }
      .resume-preview-pdf .preview-section p,
      .resume-preview-pdf .preview-content-section p,
      .resume-preview-pdf .preview-item p,
      .resume-preview-pdf .preview-content-section li { font-size: 11.5pt !important; line-height: 1.5 !important; }
    `;
    clonedElement.prepend(style);
    
    // Remove any dark theme elements
    const darkElements = clonedElement.querySelectorAll('.builder-header, .tab-navigation, .form-section-container');
    darkElements.forEach(el => el.remove());
    
    const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5], // Top, Left, Bottom, Right margin in inches
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, // increase if still too small visually
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