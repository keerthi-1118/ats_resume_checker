import React, { useState, useEffect } from 'react';
import './ResumeBuilderLanding.css';

const ResumeBuilderLanding = ({ onStartBuilder }) => {
    const [currentResume, setCurrentResume] = useState(0);
    
    const resumes = [
        {
            name: "KEERTHI TADIKONDA",
            contact: "9515446934 | Keerthitadikonda62@gmail.com | LinkedIn | GitHub",
            summary: "Driven and detail-oriented 3rd-year B.Tech Computer Science student at SRM University-AP with a strong foundation in full-stack web development and a secondary focus on finance. Passionate about building real-world tech solutions, with hands-on experience in AI/ML, IoT, and data-driven applications.",
            education: [
                { degree: "BTech CSE • 2023-2027", details: "SRM UNIVERSITY AP, CGPA:8.98" },
                { degree: "Intermediate • 2021-2023", details: "BHASHYAM, CGPA:9.7" }
            ],
            experience: [
                { title: "Salesforce developer at SMARTBRIDGE SALESFORCE (2mons Remote)", 
                  description: "Worked on customizing Salesforce applications using Apex, Visualforce, and Lightning Web Components. Assisted in integrating third-party APIs, building automation with Flows and Process Builder, and deploying changes via Change Sets. Collaborated with cross-functional teams to gather requirements and deliver scalable CRM solutions." }
            ],
            projects: [
                { title: "ATS RESUME CHECKER", link: "Link", 
                  description: "Developed an AI-powered resume optimization platform using React, Flask, and NLP tools, providing match scores, skill gap insights, and a live preview with PDF generation." },
                { title: "MOVIE TICKETS BOOKING MANAGEMENT SYSTEM", link: "Link", 
                  description: "Developed a web application to book and manage movie tickets using HTML, CSS, JS, PHP, and MySQL. Implemented user login, seat selection, and booking confirmation features. Created an admin panel to manage movies, showtimes, and bookings." }
            ],
            skills: {
                technical: "HTML, CSS, Javascript, Python, React.js, SQL, Git, VS Code",
                soft: "Communication, Leadership, Problem-Solving, Team Work, Consistency"
            }
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentResume((prev) => (prev + 1) % resumes.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, [resumes.length]);

    const currentResumeData = resumes[currentResume];

    return (
        <div className="resume-builder-landing">
            <div className="landing-content">
                <div className="brand-header">
                    <h1 className="brand-name">ResumeWithU</h1>
                </div>
                <div className="hero-section">
                    <div className="hero-text">
                        <p className="sub-heading">A Free and Open Source Resume Builder</p>
                        <h2 className="main-heading main-heading-gradient">Resume Building<br />Made Simple</h2>
                        <p className="description">
                            ResumeWithU is an ATS-friendly resume maker designed to simplify the process of creating professional resumes without the hassle of login or sign-up. With ResumeWithU, users can easily input their details, generate a well-formatted resume, and export it in A4 PDF format.
                        </p>
                        <button className="cta-button" onClick={onStartBuilder}>
                            Create My Resume
                            <span className="button-icon">🚀</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="resume-preview">
                <div className="preview-container">
                    <div className="resume-paper rotating-resume">
                        <div className="resume-header">
                            <h3 className="resume-name">{currentResumeData.name}</h3>
                            <div className="contact-info">
                                <p>{currentResumeData.contact}</p>
                            </div>
                        </div>
                        
                        <div className="resume-section">
                            <h4>SUMMARY</h4>
                            <p>{currentResumeData.summary}</p>
                        </div>
                        
                        <div className="resume-section">
                            <h4>EDUCATION</h4>
                            {currentResumeData.education.map((edu, index) => (
                                <div key={index}>
                                    <p><strong>{edu.degree}</strong></p>
                                    <p>{edu.details}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="resume-section">
                            <h4>EXPERIENCE</h4>
                            {currentResumeData.experience.map((exp, index) => (
                                <div key={index}>
                                    <p><strong>{exp.title}</strong></p>
                                    <p>{exp.description}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="resume-section">
                            <h4>PROJECTS</h4>
                            {currentResumeData.projects.map((proj, index) => (
                                <div key={index} className="project-item">
                                    <p className="project-title-row">
                                        <strong>{proj.title}</strong>
                                        <span className="project-link"><a href="#" target="_blank" rel="noopener noreferrer">{proj.link}</a></span>
                                    </p>
                                    <p>{proj.description}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="resume-section">
                            <h4>SKILLS</h4>
                            <p><strong>Technical:</strong> {currentResumeData.skills.technical}</p>
                            <p><strong>Soft:</strong> {currentResumeData.skills.soft}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilderLanding;