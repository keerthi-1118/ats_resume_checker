// src/utils/resumePdfGenerator.js
import html2pdf from 'html2pdf.js';

const generateResumePdf = (element, filename = 'resume.pdf') => {
    const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5], // Top, Left, Bottom, Right margin in inches
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
};

export default generateResumePdf;