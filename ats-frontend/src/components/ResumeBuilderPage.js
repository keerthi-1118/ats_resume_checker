// src/components/ResumeBuilderPage.js
import React, { useState } from 'react';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import generateResumePdf from '../utils/resumePdfGenerator'; // Import PDF generator
import './ResumeBuilderPage.css'; // Create this CSS file for builder page styling

function ResumeBuilderPage({ onBack }) {
    // Initial state for the resume data
    const [resumeData, setResumeData] = useState({
        contact: {
            fullName: '',
            jobTitle: '',
            email: '',
            phone: '',
            address: '',
            linkedin: '',
            github: '',
            twitter: '',
            portfolio: '',
            blogs: ''
        },
        summary: '',
        education: [
            { degree: '', university: '', year: '' }
        ],
        experience: [
            { title: '', company: '', duration: '', responsibilities: [''] }
        ],
        projects: [
            { title: '', link: '', techStack: '', description: '' }
        ],
        skills: {
            technical: [''],
            soft: ['']
        },
        certificates: [
            { name: '', issuer: '', date: '' }
        ],
        languages: [
            { name: '', proficiency: '' }
        ]
    });

    // State to manage current step in the form
    const [currentStep, setCurrentStep] = useState(0);

    // Function to handle changes in any form field
    const handleInputChange = (section, field, value, index = null, subField = null) => {
        setResumeData(prevData => {
            if (index !== null) {
                const updatedSection = [...prevData[section]];
                if (subField !== null) {
                    updatedSection[index] = {
                        ...updatedSection[index],
                        [field]: value // for skills/responsibilities
                    };
                } else {
                    updatedSection[index] = {
                        ...updatedSection[index],
                        [field]: value
                    };
                }
                return { ...prevData, [section]: updatedSection };
            } else {
                return { ...prevData, [section]: { ...prevData[section], [field]: value } };
            }
        });
    };

    // Function to handle adding new items in array fields (experience, projects, etc.)
    const handleAddItem = (section, defaultItem) => {
        setResumeData(prevData => ({
            ...prevData,
            [section]: [...prevData[section], defaultItem]
        }));
    };

    // Function to handle removing items from array fields
    const handleRemoveItem = (section, index) => {
        setResumeData(prevData => ({
            ...prevData,
            [section]: prevData[section].filter((_, i) => i !== index)
        }));
    };

    // Function to handle array field changes (e.g., skills, responsibilities)
    const handleArrayFieldChange = (section, index, value) => {
        setResumeData(prevData => {
            const updatedArray = [...prevData[section]];
            updatedArray[index] = value;
            return { ...prevData, [section]: updatedArray };
        });
    };

    // Steps definition
    const formSteps = [
        { id: 'contact', label: 'Contact', component: 'Contact' },
        { id: 'summary', label: 'Summary', component: 'Summary' },
        { id: 'education', label: 'Education', component: 'Education' },
        { id: 'experience', label: 'Experience', component: 'Experience' },
        { id: 'projects', label: 'Projects', component: 'Projects' },
        { id: 'skills', label: 'Skills', component: 'Skills' },
        { id: 'certificates', label: 'Certificates', component: 'Certificates' },
        { id: 'languages', label: 'Languages', component: 'Languages' },
    ];

    const handleNextStep = () => {
        if (currentStep < formSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleDownloadPdf = () => {
        const input = document.getElementById('resume-preview-content'); // ID of the div to convert
        if (input) {
            generateResumePdf(input);
        } else {
            alert('Resume preview not found for PDF generation.');
        }
    };

    return (
        <div className="resume-builder-page">
            <div className="builder-header">
                <button onClick={onBack} className="back-to-home-btn">← Back to Home</button>
                <h2>Create Your Resume</h2>
                <button onClick={handleDownloadPdf} className="download-pdf-btn">Download PDF</button>
            </div>
            
            <div className="builder-content">
                <div className="builder-form">
                    <ResumeForm
                        resumeData={resumeData}
                        handleInputChange={handleInputChange}
                        handleAddItem={handleAddItem}
                        handleRemoveItem={handleRemoveItem}
                        handleArrayFieldChange={handleArrayFieldChange}
                        formSteps={formSteps}
                        currentStep={currentStep}
                        onNextStep={handleNextStep}
                        onPrevStep={handlePrevStep}
                        onGoToStep={setCurrentStep}
                    />
                </div>
                <div className="builder-preview">
                    <ResumePreview resumeData={resumeData} />
                </div>
            </div>
        </div>
    );
}

export default ResumeBuilderPage;