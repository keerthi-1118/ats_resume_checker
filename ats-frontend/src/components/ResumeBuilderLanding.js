import React from 'react';
import './ResumeBuilderLanding.css';

const ResumeBuilderLanding = ({ onStartBuilder }) => {
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
                        <div className="button-container">
                            <button className="cta-button" onClick={onStartBuilder}>
                                CREATE MY RESUME
                                <span className="button-icon">🚀</span>
                            </button>
                            <button className="cta-button" onClick={() => window.location.href = '/ats-analyze'}>
                                ANALYZE RESUME
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="resume-preview">
                <div className="preview-container">
                    <img
                        src="/resume.png"
                        alt="Resume Preview"
                        className="rotating-resume resume-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilderLanding;