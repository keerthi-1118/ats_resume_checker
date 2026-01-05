
// src/components/ResumePreview.js
import React from 'react';
import './ResumePreview.css'; // Create this CSS file for preview styling

function ResumePreview({ resumeData }) {
    const { contact, summary, education, experience, projects, skills, certificates, languages } = resumeData;

    return (
        <div id="resume-preview-content" className="resume-preview">
            <div className="preview-contact-info">
                {contact.fullName && <h2>{contact.fullName}</h2>}
                {contact.jobTitle && <p className="job-title">{contact.jobTitle}</p>}
                <p>
                    {contact.email && <span>{contact.email} | </span>}
                    {contact.phone && <span>{contact.phone} | </span>}
                    {contact.address && <span>{contact.address}</span>}
                </p>
                <p>
                    {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                    {contact.github && <a href={contact.github} target="_blank" rel="noopener noreferrer"> | GitHub</a>}
                    {contact.portfolio && <a href={contact.portfolio} target="_blank" rel="noopener noreferrer"> | Portfolio</a>}
                    {contact.blogs && <a href={contact.blogs} target="_blank" rel="noopener noreferrer"> | Blog</a>}
                    {contact.twitter && <a href={`https://twitter.com/${contact.twitter}`} target="_blank" rel="noopener noreferrer"> | Twitter</a>}
                </p>
            </div>

            {summary && <div className="preview-section">
                <h3>Summary</h3>
                <p>{summary}</p>
            </div>}

            {education.some(edu => edu.degree) && <div className="preview-section">
                <h3>Education</h3>
                {education.map((edu, index) => (
                    <div key={index} className="preview-item">
                        <p><strong>{edu.degree}</strong> {edu.university && `from ${edu.university}`} {edu.year && `(${edu.year})`}</p>
                    </div>
                ))}
            </div>}

            {experience.some(exp => exp.title) && <div className="preview-section">
                <h3>Experience</h3>
                {experience.map((exp, index) => (
                    <div key={index} className="preview-item">
                        <p><strong>{exp.title}</strong> {exp.company && `at ${exp.company}`} {exp.duration && `(${exp.duration})`}</p>
                        {exp.responsibilities && exp.responsibilities.length > 0 && <ul>
                            {exp.responsibilities.map((resp, i) => resp && <li key={i}>{resp}</li>)}
                        </ul>}
                    </div>
                ))}
            </div>}

            {projects.some(proj => proj.title) && <div className="preview-section">
                <h3>Projects</h3>
                {projects.map((proj, index) => (
                    <div key={index} className="preview-item">
                        <p><strong>{proj.title}</strong></p>
                        {proj.link && <p className="preview-link"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></p>}
                        {proj.techStack && <p className="preview-tech-stack"><em>Tech Stack: {proj.techStack}</em></p>}
                        {proj.description && <p>{proj.description}</p>}
                    </div>
                ))}
            </div>}

            {(skills.technical.some(skill => skill) || skills.soft.some(skill => skill)) && <div className="preview-section">
                <h3>Skills</h3>
                {skills.technical.some(skill => skill) && <p><strong>Technical:</strong> {skills.technical.filter(s => s).join(', ')}</p>}
                {skills.soft.some(skill => skill) && <p><strong>Soft:</strong> {skills.soft.filter(s => s).join(', ')}</p>}
            </div>}

            {certificates.some(cert => cert.name) && <div className="preview-section">
                <h3>Certifications</h3>
                <ul>
                    {certificates.map((cert, index) => (
                        cert.name && <li key={index}><strong>{cert.name}</strong> {cert.issuer && `by ${cert.issuer}`} {cert.date && `(${cert.date})`}</li>
                    ))}
                </ul>
            </div>}

            {languages.some(lang => lang.name) && <div className="preview-section">
                <h3>Languages</h3>
                <ul>
                    {languages.map((lang, index) => (
                        lang.name && <li key={index}><strong>{lang.name}</strong> {lang.proficiency && `(${lang.proficiency})`}</li>
                    ))}
                </ul>
            </div>}
        </div>
    );
}
export default ResumePreview;
