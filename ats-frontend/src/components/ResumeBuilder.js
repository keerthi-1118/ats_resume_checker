import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import generateResumePdf from '../utils/resumePdfGenerator';
import './ResumeBuilder.css';

function isUrl(str) {
    return /^https?:\/\//i.test(str);
}

const ResumeBuilder = ({ onBackToLanding }) => {
    const [activeTab, setActiveTab] = useState('contact');
    const [formData, setFormData] = useState({
        contact: {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            linkedin: '',
            github: '',
            portfolio: '',
            blogs: ''
        },
        summary: {
            summary: ''
        },
        education: [
            { degree: '', university: '', year: '', cgpa: '' }
        ],
        experience: [
            { title: '', company: '', duration: '', location: '', responsibilities: [''] }
        ],
        projects: [
            { title: '', link: '', description: '' }
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

    const tabs = [
        { id: 'contact', label: 'Contact', icon: '👤' },
        { id: 'summary', label: 'Summary', icon: '📝' },
        { id: 'education', label: 'Education', icon: '🎓' },
        { id: 'experience', label: 'Experience', icon: '💼' },
        { id: 'projects', label: 'Projects', icon: '🚀' },
        { id: 'skills', label: 'Skills', icon: '⚡' },
        { id: 'certificates', label: 'Certificates', icon: '🏆' },
        { id: 'languages', label: 'Languages', icon: '🌍' }
    ];

    const handleInputChange = (section, field, value, index = null) => {
        setFormData(prev => {
            if (index !== null) {
                const updatedSection = [...prev[section]];
                updatedSection[index] = {
                    ...updatedSection[index],
                    [field]: value
                };
                return { ...prev, [section]: updatedSection };
            } else {
                return { ...prev, [section]: { ...prev[section], [field]: value } };
            }
        });
    };

    const handleArrayChange = (section, index, field, value) => {
        setFormData(prev => {
            const updatedSection = [...prev[section]];
            updatedSection[index] = {
                ...updatedSection[index],
                [field]: value
            };
            return { ...prev, [section]: updatedSection };
        });
    };

    const handleSkillsChange = (type, index, value) => {
        setFormData(prev => {
            const updatedSkills = [...prev.skills[type]];
            updatedSkills[index] = value;
            return {
                ...prev,
                skills: {
                    ...prev.skills,
                    [type]: updatedSkills
                }
            };
        });
    };

    const addArrayItem = (section, defaultItem) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], defaultItem]
        }));
    };

    const removeArrayItem = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const addSkill = (type) => {
        setFormData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [type]: [...prev.skills[type], '']
            }
        }));
    };

    const removeSkill = (type, index) => {
        setFormData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [type]: prev.skills[type].filter((_, i) => i !== index)
            }
        }));
    };

    const handleDownload = () => {
        try {
            // Get the resume preview element - use the correct class selector
            const resumeElement = document.querySelector('.resume-preview-paper');
            
            if (!resumeElement) {
                alert('Resume preview not found. Please try again.');
                return;
            }

            // Show loading message
            const downloadButton = document.querySelector('.download-button');
            const originalText = downloadButton.innerHTML;
            downloadButton.innerHTML = 'Generating PDF... <span class="download-icon">⏳</span>';
            downloadButton.disabled = true;

            // Use the new PDF generator function
            const filename = `${formData.contact.fullName || 'resume'}.pdf`;
            generateResumePdf(resumeElement, filename);

            // Reset button after a short delay
            setTimeout(() => {
                downloadButton.innerHTML = originalText;
                downloadButton.disabled = false;
            }, 2000);

        } catch (error) {
            console.error('Error in handleDownload:', error);
            alert('An error occurred while generating the PDF. Please try again.');
            
            // Reset button
            const downloadButton = document.querySelector('.download-button');
            if (downloadButton) {
                downloadButton.innerHTML = 'Download PDF <span class="download-icon">📄</span>';
                downloadButton.disabled = false;
            }
        }
    };

    const renderContactForm = () => (
        <div className="form-section">
            <div className="form-columns">
                <div className="form-column">
                    <div className="form-field">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            value={formData.contact.fullName}
                            onChange={(e) => handleInputChange('contact', 'fullName', e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.contact.email}
                            onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>Phone</label>
                        <input
                            type="text"
                            value={formData.contact.phone}
                            onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>Address</label>
                        <input
                            type="text"
                            value={formData.contact.address}
                            onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>LinkedIn</label>
                        <input
                            type="text"
                            value={formData.contact.linkedin}
                            onChange={(e) => handleInputChange('contact', 'linkedin', e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-column">
                    <div className="form-field">
                        <label>GitHub</label>
                        <input
                            type="text"
                            value={formData.contact.github}
                            onChange={(e) => handleInputChange('contact', 'github', e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>Portfolio</label>
                        <input
                            type="text"
                            value={formData.contact.portfolio}
                            onChange={(e) => handleInputChange('contact', 'portfolio', e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>Blogs</label>
                        <input
                            type="text"
                            value={formData.contact.blogs}
                            onChange={(e) => handleInputChange('contact', 'blogs', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSummaryForm = () => (
        <div className="form-section">
            <div className="form-field">
                <label>Professional Summary</label>
                <textarea
                    value={formData.summary.summary}
                    onChange={(e) => handleInputChange('summary', 'summary', e.target.value)}
                    rows="6"
                    placeholder="Write a brief professional summary..."
                />
            </div>
        </div>
    );

    const renderEducationForm = () => (
        <div className="form-section">
            {formData.education.map((edu, index) => (
                <div key={index} className="education-item">
                    <div className="form-columns">
                        <div className="form-column">
                            <div className="form-field">
                                <label>Degree/Major</label>
                                <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label>University/School</label>
                                <input
                                    type="text"
                                    value={edu.university}
                                    onChange={(e) => handleArrayChange('education', index, 'university', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-column">
                            <div className="form-field">
                                <label>Year</label>
                                <input
                                    type="text"
                                    value={edu.year}
                                    onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label>CGPA</label>
                                <input
                                    type="text"
                                    value={edu.cgpa}
                                    onChange={(e) => handleArrayChange('education', index, 'cgpa', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {formData.education.length > 1 && (
                        <button 
                            type="button" 
                            className="remove-btn"
                            onClick={() => removeArrayItem('education', index)}
                        >
                            Remove Education
                        </button>
                    )}
                </div>
            ))}
            <button 
                type="button" 
                className="add-btn"
                onClick={() => addArrayItem('education', { degree: '', university: '', year: '', cgpa: '' })}
            >
                Add Education
            </button>
        </div>
    );

    const renderExperienceForm = () => (
        <div className="form-section">
            {formData.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                    <div className="form-columns">
                        <div className="form-column">
                            <div className="form-field">
                                <label>Job Title</label>
                                <input
                                    type="text"
                                    value={exp.title}
                                    onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label>Company</label>
                                <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-column">
                            <div className="form-field">
                                <label>Duration</label>
                                <input
                                    type="text"
                                    value={exp.duration}
                                    onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={exp.location}
                                    onChange={(e) => handleArrayChange('experience', index, 'location', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-field">
                        <label>Responsibilities</label>
                        {exp.responsibilities.map((resp, respIndex) => (
                            <div key={respIndex} className="responsibility-item">
                                <input
                                    type="text"
                                    value={resp}
                                    onChange={(e) => {
                                        const newResps = [...exp.responsibilities];
                                        newResps[respIndex] = e.target.value;
                                        handleArrayChange('experience', index, 'responsibilities', newResps);
                                    }}
                                    placeholder="Enter responsibility..."
                                />
                                {exp.responsibilities.length > 1 && (
                                    <button 
                                        type="button" 
                                        className="remove-small-btn"
                                        onClick={() => {
                                            const newResps = exp.responsibilities.filter((_, i) => i !== respIndex);
                                            handleArrayChange('experience', index, 'responsibilities', newResps);
                                        }}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            className="add-small-btn"
                            onClick={() => {
                                const newResps = [...exp.responsibilities, ''];
                                handleArrayChange('experience', index, 'responsibilities', newResps);
                            }}
                        >
                            Add Responsibility
                        </button>
                    </div>
                    {formData.experience.length > 1 && (
                        <button 
                            type="button" 
                            className="remove-btn"
                            onClick={() => removeArrayItem('experience', index)}
                        >
                            Remove Experience
                        </button>
                    )}
                </div>
            ))}
            <button 
                type="button" 
                className="add-btn"
                onClick={() => addArrayItem('experience', { title: '', company: '', duration: '', location: '', responsibilities: [''] })}
            >
                Add Experience
            </button>
        </div>
    );

    const renderProjectsForm = () => (
        <div className="form-section">
            {formData.projects.map((proj, index) => (
                <div key={index} className="project-item">
                    <div className="form-columns">
                        <div className="form-column">
                            <div className="form-field">
                                <label>Project Title</label>
                                <input
                                    type="text"
                                    value={proj.title}
                                    onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label>Project Link</label>
                                <input
                                    type="text"
                                    value={proj.link}
                                    onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-column">
                            <div className="form-field">
                                <label>Description</label>
                                <textarea
                                    value={proj.description}
                                    onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                                    rows="4"
                                />
                            </div>
                        </div>
                    </div>
                    {formData.projects.length > 1 && (
                        <button 
                            type="button" 
                            className="remove-btn"
                            onClick={() => removeArrayItem('projects', index)}
                        >
                            Remove Project
                        </button>
                    )}
                </div>
            ))}
            <button 
                type="button" 
                className="add-btn"
                onClick={() => addArrayItem('projects', { title: '', link: '', description: '' })}
            >
                Add Project
            </button>
        </div>
    );

    const renderSkillsForm = () => (
        <div className="form-section">
            <div className="skills-section">
                <h4>Technical Skills</h4>
                {formData.skills.technical.map((skill, index) => (
                    <div key={index} className="skill-item">
                        <input
                            type="text"
                            value={skill}
                            onChange={(e) => handleSkillsChange('technical', index, e.target.value)}
                            placeholder="Enter technical skill..."
                        />
                        {formData.skills.technical.length > 1 && (
                            <button 
                                type="button" 
                                className="remove-small-btn"
                                onClick={() => removeSkill('technical', index)}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                <button 
                    type="button" 
                    className="add-small-btn"
                    onClick={() => addSkill('technical')}
                >
                    Add Technical Skill
                </button>
            </div>
            
            <div className="skills-section">
                <h4>Soft Skills</h4>
                {formData.skills.soft.map((skill, index) => (
                    <div key={index} className="skill-item">
                        <input
                            type="text"
                            value={skill}
                            onChange={(e) => handleSkillsChange('soft', index, e.target.value)}
                            placeholder="Enter soft skill..."
                        />
                        {formData.skills.soft.length > 1 && (
                            <button 
                                type="button" 
                                className="remove-small-btn"
                                onClick={() => removeSkill('soft', index)}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                <button 
                    type="button" 
                    className="add-small-btn"
                    onClick={() => addSkill('soft')}
                >
                    Add Soft Skill
                </button>
            </div>
        </div>
    );

    const renderCertificatesForm = () => (
        <div className="form-section">
            {formData.certificates.map((cert, index) => (
                <div key={index} className="certificate-item">
                    <div className="form-columns">
                        <div className="form-column">
                            <div className="form-field">
                                <label>Certificate Name</label>
                                <input
                                    type="text"
                                    value={cert.name}
                                    onChange={(e) => handleArrayChange('certificates', index, 'name', e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label>Issuing Organization</label>
                                <input
                                    type="text"
                                    value={cert.issuer}
                                    onChange={(e) => handleArrayChange('certificates', index, 'issuer', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-column">
                            <div className="form-field">
                                <label>Date</label>
                                <input
                                    type="text"
                                    value={cert.date}
                                    onChange={(e) => handleArrayChange('certificates', index, 'date', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {formData.certificates.length > 1 && (
                        <button 
                            type="button" 
                            className="remove-btn"
                            onClick={() => removeArrayItem('certificates', index)}
                        >
                            Remove Certificate
                        </button>
                    )}
                </div>
            ))}
            <button 
                type="button" 
                className="add-btn"
                onClick={() => addArrayItem('certificates', { name: '', issuer: '', date: '' })}
            >
                Add Certificate
            </button>
        </div>
    );

    const renderLanguagesForm = () => (
        <div className="form-section">
            {formData.languages.map((lang, index) => (
                <div key={index} className="language-item">
                    <div className="form-columns">
                        <div className="form-column">
                            <div className="form-field">
                                <label>Language</label>
                                <input
                                    type="text"
                                    value={lang.name}
                                    onChange={(e) => handleArrayChange('languages', index, 'name', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-column">
                            <div className="form-field">
                                <label>Proficiency Level</label>
                                <input
                                    type="text"
                                    value={lang.proficiency}
                                    onChange={(e) => handleArrayChange('languages', index, 'proficiency', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {formData.languages.length > 1 && (
                        <button 
                            type="button" 
                            className="remove-btn"
                            onClick={() => removeArrayItem('languages', index)}
                        >
                            Remove Language
                        </button>
                    )}
                </div>
            ))}
            <button 
                type="button" 
                className="add-btn"
                onClick={() => addArrayItem('languages', { name: '', proficiency: '' })}
            >
                Add Language
            </button>
        </div>
    );

    const renderFormContent = () => {
        switch (activeTab) {
            case 'contact':
                return renderContactForm();
            case 'summary':
                return renderSummaryForm();
            case 'education':
                return renderEducationForm();
            case 'experience':
                return renderExperienceForm();
            case 'projects':
                return renderProjectsForm();
            case 'skills':
                return renderSkillsForm();
            case 'certificates':
                return renderCertificatesForm();
            case 'languages':
                return renderLanguagesForm();
            default:
                return renderContactForm();
        }
    };

    return (
        <div className="resume-builder">
            <div className="builder-header">
                <div className="header-left">
                    <h1 className="app-name">ResumeWithU</h1>
                </div>
                <div className="header-right">
                    <nav className="tab-navigation">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                <span className="tab-label">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="builder-content">
                <div className="preview-section">
                    <div className="preview-container">
                        <div className="resume-preview-paper">
                            {/* Contact Information */}
                            <div className="preview-header">
                                <h3 className="preview-name">{formData.contact.fullName || 'Your Name'}</h3>
                                <div className="preview-contact">
                                                                           <p>
                                           {formData.contact.phone && <span className="contact-item">{formData.contact.phone}</span>}
                                           {formData.contact.phone && formData.contact.email && <span className="contact-separator"> | </span>}
                                           {formData.contact.email && <span className="contact-item">{formData.contact.email}</span>}
                                           {formData.contact.email && formData.contact.linkedin && <span className="contact-separator"> | </span>}
                                           {formData.contact.linkedin && <span className="contact-item">{isUrl(formData.contact.linkedin) ? <a href={formData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a> : formData.contact.linkedin}</span>}
                                           {formData.contact.linkedin && formData.contact.github && <span className="contact-separator"> | </span>}
                                           {formData.contact.github && <span className="contact-item">{isUrl(formData.contact.github) ? <a href={formData.contact.github} target="_blank" rel="noopener noreferrer">GitHub</a> : formData.contact.github}</span>}
                                       </p>
                                    {(formData.contact.portfolio || formData.contact.blogs) && (
                                        <p>
                                            {formData.contact.portfolio && <span className="contact-item">{isUrl(formData.contact.portfolio) ? <a href={formData.contact.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a> : formData.contact.portfolio}</span>}
                                            {formData.contact.portfolio && formData.contact.blogs && <span className="contact-separator"> | </span>}
                                            {formData.contact.blogs && <span className="contact-item">{isUrl(formData.contact.blogs) ? <a href={formData.contact.blogs} target="_blank" rel="noopener noreferrer">Blogs</a> : formData.contact.blogs}</span>}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="preview-content-section">
                                <h4>SUMMARY</h4>
                                {formData.summary.summary ? (
                                    <p>{formData.summary.summary}</p>
                                ) : (
                                    <p style={{ color: '#999', fontStyle: 'italic' }}>Enter your professional summary here...</p>
                                )}
                            </div>

                            {/* Education */}
                            {formData.education.some(edu => edu.degree || edu.university) && (
                                <div className="preview-content-section">
                                    <h4>EDUCATION</h4>
                                    {formData.education.map((edu, index) => (
                                        edu.degree || edu.university ? (
                                            <div key={index} className="preview-item">
                                                <p><strong>{edu.degree}</strong>{edu.year && ` • ${edu.year}`}</p>
                                                <p>{edu.university}{edu.cgpa && <span>, <strong>CGPA:{edu.cgpa}</strong></span>}</p>
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            )}

                            {/* Experience */}
                            {formData.experience.some(exp => exp.title || exp.company) && (
                                <div className="preview-content-section">
                                    <h4>EXPERIENCE</h4>
                                    {formData.experience.map((exp, index) => (
                                        exp.title || exp.company ? (
                                            <div key={index} className="preview-item">
                                                <p><strong>{exp.title}</strong>{exp.company && ` at ${exp.company}`}{exp.duration && ` (${exp.duration})`}</p>
                                                {exp.location && <p>{exp.location}</p>}
                                                {exp.responsibilities && exp.responsibilities.length > 0 && exp.responsibilities.some(r => r) && (
                                                    <ul>
                                                        {exp.responsibilities.map((resp, i) => resp && <li key={i}>{resp}</li>)}
                                                    </ul>
                                                )}
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            )}

                            {/* Projects */}
                            {formData.projects.some(proj => proj.title) && (
                                <div className="preview-content-section">
                                    <h4>PROJECTS</h4>
                                    {formData.projects.map((proj, index) => (
                                        proj.title ? (
                                            <div key={index} className="preview-item">
                                                <p className="project-title-row">
                                                    <strong>{proj.title}</strong>
                                                    {proj.link && <span className="project-link"><a href={proj.link} target="_blank" rel="noopener noreferrer">Link</a></span>}
                                                </p>
                                                {proj.description && <p>{proj.description}</p>}
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            )}

                            {/* Skills */}
                            {(formData.skills.technical.some(skill => skill) || formData.skills.soft.some(skill => skill)) && (
                                <div className="preview-content-section">
                                    <h4>SKILLS</h4>
                                    {formData.skills.technical.some(skill => skill) && (
                                        <div>
                                            <p><strong>Technical:</strong> {formData.skills.technical.filter(skill => skill).join(', ')}</p>
                                        </div>
                                    )}
                                    {formData.skills.soft.some(skill => skill) && (
                                        <div>
                                            <p><strong>Soft:</strong> {formData.skills.soft.filter(skill => skill).join(', ')}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Certificates */}
                            {formData.certificates.some(cert => cert.name) && (
                                <div className="preview-content-section">
                                    <h4>CERTIFICATIONS</h4>
                                    <ul>
                                        {formData.certificates.map((cert, index) => (
                                            cert.name ? (
                                                <li key={index}>
                                                    <strong>{cert.name}</strong>{cert.issuer && ` by ${cert.issuer}`}{cert.date && ` (${cert.date})`}
                                                </li>
                                            ) : null
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Languages */}
                            {formData.languages.some(lang => lang.name) && (
                                <div className="preview-content-section">
                                    <h4>LANGUAGES</h4>
                                    <ul>
                                        {formData.languages.map((lang, index) => (
                                            lang.name ? (
                                                <li key={index}>
                                                    <strong>{lang.name}</strong>{lang.proficiency && ` (${lang.proficiency})`}
                                                </li>
                                            ) : null
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-section-container">
                    <div className="form-content">
                        {renderFormContent()}
                        <div className="form-actions">
                            <button className="back-button" onClick={onBackToLanding}>
                                Back
                                <span className="back-icon">←</span>
                            </button>
                            <div className="right-buttons">
                                <button className="download-button" onClick={handleDownload}>
                                    Download PDF
                                    <span className="download-icon">📄</span>
                                </button>
                                <button className="save-button">
                                    Save
                                    <span className="save-icon">💾</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;