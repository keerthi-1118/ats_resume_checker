import React from 'react';
import './ResumeBuilderLanding.css';

const ResumeBuilderLanding = ({ onStartBuilder }) => {
    return (
        <div className="resume-builder-landing">
            <div className="landing-content">
                <div className="brand-header">
                    <h1 className="brand-name">ResumeWithV</h1>
                </div>
                <div className="hero-section">
                    <div className="hero-text">
                        <p className="sub-heading">A Free and Open Source Resume Builder</p>
                        <h2 className="main-heading main-heading-gradient">Resume Building<br />Made Simple</h2>
                        <p className="description">
                            ResumeWithV is an ATS-friendly resume maker designed to simplify the process of creating professional resumes without the hassle of login or sign-up. With ResumeWithV, users can easily input their details, generate a well-formatted resume, and export it in A4 PDF format.
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
                    <div className="resume-paper">
                        <div className="resume-header">
                            <h3 className="resume-name">Prateek Singh</h3>
                            <div className="contact-info">
                                <p>+91 1234567890</p>
                                <p>devxprite@gmail.com</p>
                                <p>LinkedIn • Github • Twitter • Portfolio</p>
                            </div>
                        </div>
                        <div className="resume-section">
                            <h4>SUMMARY</h4>
                            <p>Experienced software developer with expertise in modern web technologies and a passion for creating efficient, scalable solutions.</p>
                        </div>
                        <div className="resume-section">
                            <h4>EDUCATION</h4>
                            <p><strong>Bachelor of Technology in Computer Science</strong></p>
                            <p>University Name • 2020-2024</p>
                        </div>
                        <div className="resume-section">
                            <h4>EXPERIENCE</h4>
                            <p><strong>Software Developer</strong> • Company Name • 2023-Present</p>
                            <ul>
                                <li>Developed and maintained web applications using React and Node.js</li>
                                <li>Collaborated with cross-functional teams to deliver high-quality software</li>
                                <li>Implemented best practices for code quality and performance</li>
                            </ul>
                        </div>
                        <div className="resume-section">
                            <h4>PROJECTS</h4>
                            <p><strong>E-commerce Platform</strong></p>
                            <p>Built a full-stack e-commerce solution with React, Node.js, and MongoDB</p>
                        </div>
                        <div className="resume-section">
                            <h4>SKILLS</h4>
                            <p>JavaScript, React, Node.js, Python, SQL, Git, Docker</p>
                        </div>
                        <div className="resume-section">
                            <h4>CERTIFICATIONS</h4>
                            <p>AWS Certified Developer Associate</p>
                        </div>
                        <div className="resume-section">
                            <h4>LANGUAGES</h4>
                            <p>English (Native), Hindi (Fluent), Spanish (Intermediate)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilderLanding;