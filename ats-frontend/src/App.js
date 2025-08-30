import React, { useState, useEffect } from 'react'; // Added useEffect
import axios from 'axios';
import Sidebar from './components/Sidebar';
import './App.css';
import ResumeBuilder from './components/ResumeBuilder';
import ResumeBuilderLanding from './components/ResumeBuilderLanding';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // Keep summary states as per your current working code
    const [summary, setSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [activeTab, setActiveTab] = useState('analysis');
    
    // New state for score animation
    const [displayedScore, setDisplayedScore] = useState(0); 
    
    // New state for current page
    const [currentPage, setCurrentPage] = useState('ats-analyze');
    
    // New state for resume builder flow
    const [showResumeForm, setShowResumeForm] = useState(false);

    // Effect for score animation
    useEffect(() => {
        if (analysisResults && analysisResults.analysis.overall_score !== undefined) {
            const finalScore = parseFloat(analysisResults.analysis.overall_score);
            setDisplayedScore(0); // Reset immediately before starting animation
            let current = 0;
            const increment = finalScore / 60; // 60 frames for ~1 second animation
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalScore) {
                    setDisplayedScore(finalScore);
                    clearInterval(timer);
                } else {
                    setDisplayedScore(parseFloat(current.toFixed(2)));
                }
            }, 16); // ~60 FPS
            return () => clearInterval(timer);
        }
    }, [analysisResults]); // Re-run effect when analysisResults change

    const handleNavigation = (page) => {
        setCurrentPage(page);
        // Reset states when navigating
        if (page === 'ats-analyze') {
            setAnalysisResults(null);
            setSummary(null);
            setError('');
            setLoading(false);
            setSummaryLoading(false);
            setDisplayedScore(0);
            setActiveTab('analysis');
        }
        // Reset resume builder state when navigating away
        if (page !== 'resume-builder') {
            setShowResumeForm(false);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setSelectedFile(event.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setDragActive(false);
    };

    const handleDescriptionChange = (event) => {
        setJobDescription(event.target.value);
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            setError('Please select a resume file.');
            return;
        }
        setError('');
        setAnalysisResults(null);
        setSummary(null); // Clear summary too
        setDisplayedScore(0); // Reset score display
        setLoading(true);
        setActiveTab('analysis');

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('job_description', jobDescription);

        try {
            const response = await axios.post('http://127.0.0.1:5000/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAnalysisResults(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error analyzing resume:', error);
            setError('Failed to analyze resume. Please try again.');
            setLoading(false);
        }
    };

    // Your existing handleSummary function
    const handleSummary = async () => {
        if (!selectedFile) {
            setError('Please select a resume file.');
            return;
        }
        setError('');
        setSummaryLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const response = await axios.post('http://127.0.0.1:5000/resume_summary', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSummary(response.data.summary);
            setSummaryLoading(false);
        } catch (error) {
            console.error('Error getting summary:', error);
            setError('Failed to get summary. Please try again.');
            setSummaryLoading(false);
        }
    };


    // Render different pages based on currentPage
    const renderPage = () => {
        switch (currentPage) {
            case 'resume-builder':
                return showResumeForm ? (
                    <ResumeBuilder onBackToLanding={() => setShowResumeForm(false)} />
                ) : (
                    <ResumeBuilderLanding onStartBuilder={() => setShowResumeForm(true)} />
                );
            
            case 'home':
                return (
                    <div className="App initial-screen">
                        <h1>Welcome to ATS Tools</h1>
                        <p>Choose a tool from the sidebar to get started.</p>
                        <button onClick={() => handleNavigation('ats-analyze')}>
                            Go to ATS Analyze
                        </button>
                    </div>
                );
            
            case 'ats-analyze':
            default:
                // Initial screen (centered, pastel bg)
                if (!analysisResults && !loading) {
                    return (
                        <div className="App initial-screen">
                            <h1>ATS Resume Checker</h1>
                            <div
                                className={`dropzone${dragActive ? ' dragover' : ''}`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                {selectedFile ? (
                                    <span>{selectedFile.name}</span>
                                ) : (
                                    <span>Drag & Drop your resume here, or <u>click to browse</u></span>
                                )}
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <label htmlFor="jobDescription">Paste Job Description:</label>
                            <textarea
                                id="jobDescription"
                                rows="5"
                                cols="50"
                                value={jobDescription}
                                onChange={handleDescriptionChange}
                            />
                            <button onClick={handleAnalyze} disabled={loading}>
                                {loading ? 'Analyzing...' : 'Analyze Resume'}
                            </button>
                            {error && <p className="error">{error}</p>}
                        </div>
                    );
                }

                // After analysis: show tabbed layout with light grey bg
                return (
                    <div className="analyze-page-bg">
                        <div className="tabs-header">
                            <div
                                className={`tab${activeTab === 'analysis' ? ' active' : ''}`}
                                onClick={() => setActiveTab('analysis')}
                            >
                                ATS Analysis
                            </div>
                            <div
                                className={`tab${activeTab === 'summary' ? ' active' : ''}`}
                                onClick={async () => {
                                    setActiveTab('summary');
                                    // Only fetch summary if it hasn't been fetched yet
                                    if (!summary && !summaryLoading) {
                                        await handleSummary();
                                    }
                                }}
                            >
                                Resume Summary
                            </div>
                        </div>
                        <div className="tab-content">
                            {loading ? (
                                <div className="loading-content">Analyzing...</div>
                            ) : error ? (
                                <div className="error-content">{error}</div>
                            ) : analysisResults && (
                                <>
                                    {activeTab === 'analysis' && (
                                        <div className="results">
                                            <h3 className="results-title">ATS Analysis for {analysisResults.filename}</h3>

                                            {/* Score Gauge */}
                                            <div className="score-gauge-container">
                                                <div className="score-gauge" style={{ '--score-percentage': `${displayedScore}%` }}>
                                                    <div className="score-bar"></div>
                                                    <div className="score-text">
                                                        {displayedScore.toFixed(0)}% {/* Display as integer % */}
                                                        <span className="score-label">Match</span>
                                                    </div>
                                                </div>
                                                <div className="score-description">
                                                    <p>Your resume matches the job description by <strong>{analysisResults.analysis.overall_score}%</strong>.</p>
                                                    {parseFloat(analysisResults.analysis.overall_score) < 50 && (
                                                        <p className="suggestion low">Consider tailoring your resume more closely to the JD's requirements.</p>
                                                    )}
                                                    {parseFloat(analysisResults.analysis.overall_score) >= 50 && parseFloat(analysisResults.analysis.overall_score) < 75 && (
                                                        <p className="suggestion medium">A good start! Review missing skills for potential improvements.</p>
                                                    )}
                                                    {parseFloat(analysisResults.analysis.overall_score) >= 75 && (
                                                        <p className="suggestion high">Excellent match! You're a strong candidate for this role.</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Skills Comparison Section */}
                                            <div className="skills-comparison-section">
                                                <h4 className="section-title">Skills Overview</h4>
                                                <div className="skills-columns">
                                                    <div className="skills-list match-skills">
                                                        <h5 className="skills-title">Matching Skills <span className="icon-check">✔</span></h5>
                                                        {analysisResults.analysis.matching_skills && analysisResults.analysis.matching_skills.length > 0 ? (
                                                            <ul>
                                                                {analysisResults.analysis.matching_skills.map((skill, index) => (
                                                                    <li key={index} className="skill-item match">
                                                                        {skill}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p>No direct matching skills found.</p>
                                                        )}
                                                    </div>
                                                    <div className="skills-list miss-skills">
                                                        <h5 className="skills-title">Missing Skills <span className="icon-cross">✖</span></h5>
                                                        {analysisResults.analysis.missing_skills && analysisResults.analysis.missing_skills.length > 0 ? (
                                                            <ul>
                                                                {analysisResults.analysis.missing_skills.map((skill, index) => (
                                                                    <li key={index} className="skill-item miss">
                                                                        {skill}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p>No critical missing skills identified.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Other Analysis Details */}
                                            {analysisResults.analysis.semantic_similarity_score && (
                                                <div className="analysis-detail-section">
                                                    <h4>Semantic Similarity Score:</h4>
                                                    <p>{analysisResults.analysis.semantic_similarity_score}</p>
                                                </div>
                                            )}
                                            {analysisResults.analysis.sections_found && analysisResults.analysis.sections_found.length > 0 && (
                                                <div className="analysis-detail-section">
                                                    <h4>Sections Found:</h4>
                                                    <p>{analysisResults.analysis.sections_found.join(', ')}</p>
                                                </div>
                                            )}
                                            {analysisResults.analysis.action_verbs_found && analysisResults.analysis.action_verbs_found.length > 0 && (
                                                <div className="analysis-detail-section">
                                                    <h4>Action Verbs Found:</h4>
                                                    <p>{analysisResults.analysis.action_verbs_found.join(', ')}</p>
                                                </div>
                                            )}
                                            {analysisResults.analysis.extra_skills && analysisResults.analysis.extra_skills.length > 0 && (
                                                <div className="analysis-detail-section">
                                                    <h4>Extra Skills (Resume Only):</h4>
                                                    <p>{analysisResults.analysis.extra_skills.join(', ')}</p>
                                                </div>
                                            )}
                                            {analysisResults.analysis.resume_skills && (
                                                <details className="debug-skills-details">
                                                    <summary>Extracted Resume Skills (for debugging)</summary>
                                                    <p>{analysisResults.analysis.resume_skills.join(', ')}</p>
                                                </details>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'summary' && (
                                        summaryLoading ? (
                                            <div className="summary-loading">Loading summary...</div>
                                        ) : summary ? (
                                            (() => {
                                                // Defensive mapping for string arrays
                                                const mappedProjects = Array.isArray(summary.projects) && summary.projects.length > 0 && typeof summary.projects[0] === 'string'
                                                    ? summary.projects.map(p => ({ title: p }))
                                                    : summary.projects;
                                                const mappedWork = Array.isArray(summary.work_experience) && summary.work_experience.length > 0 && typeof summary.work_experience[0] === 'string'
                                                    ? summary.work_experience.map(w => ({ title: w }))
                                                    : summary.work_experience;
                                                const mappedCerts = Array.isArray(summary.certifications) && summary.certifications.length > 0 && typeof summary.certifications[0] === 'string'
                                                    ? summary.certifications.map(c => ({ name: c }))
                                                    : summary.certifications;
                                                return (
                                                    <div className="summary-display-area">
                                                        <h3 className="results-title">Resume Summary for {summary?.name || analysisResults.filename}</h3>
                                                        <div className="summary-section">
                                                            <h4>Contact Information:</h4>
                                                            <p><strong>Name:</strong> {summary.name || 'N/A'}</p>
                                                            <p><strong>Email:</strong> {summary.email || 'N/A'}</p>
                                                            <p><strong>Phone:</strong> {summary.phone || 'N/A'}</p>
                                                            {summary.linkedin && (
                                                                <p><strong>LinkedIn:</strong> <a href={summary.linkedin} target="_blank" rel="noopener noreferrer">{summary.linkedin}</a></p>
                                                            )}
                                                            {summary.github && (
                                                                <p><strong>GitHub:</strong> <a href={summary.github} target="_blank" rel="noopener noreferrer">{summary.github}</a></p>
                                                            )}
                                                            {summary.portfolio && (
                                                                <p><strong>Portfolio:</strong> <a href={summary.portfolio} target="_blank" rel="noopener noreferrer">{summary.portfolio}</a></p>
                                                            )}
                                                        </div>
                                                        {mappedProjects && mappedProjects.length > 0 && (
                                                            <div className="summary-section">
                                                                <h4>Projects:</h4>
                                                                {mappedProjects.map((project, index) => {
                                                                    // Remove ' Link' or ' link' from the end of the project title
                                                                    const cleanTitle = project.title ? project.title.replace(/\s*link$/i, '') : '';
                                                                    return (
                                                                        <div key={index} className="summary-item">
                                                                            <p><strong>{cleanTitle}</strong></p>
                                                                            {/* Render points/lines as normal text, not bold */}
                                                                            {project.description && <p className="project-point">{project.description}</p>}
                                                                        </div>
                                                                    );
                                                                })}
                                                                {/* Show overall tech stack if available */}
                                                                {summary.tech_stack && summary.tech_stack.length > 0 && (
                                                                    <div className="summary-tech-stack"><strong>Tech Stack:</strong> {summary.tech_stack.join(', ')}</div>
                                                                )}
                                                                {/* If no tech stack, show N/A */}
                                                                {(!summary.tech_stack || summary.tech_stack.length === 0) && (
                                                                    <div className="summary-tech-stack"><strong>Tech Stack:</strong> N/A</div>
                                                                )}
                                                            </div>
                                                        )}
                                                        {/* Always show Work Experience section */}
                                                        <div className="summary-section compact-section">
                                                            <h4>Work Experience:</h4>
                                                            {mappedWork && mappedWork.length > 0 ? (
                                                                mappedWork.map((job, index) => (
                                                                    <div key={index} className="summary-item">
                                                                        <p>{job.title}</p>
                                                                        {job.responsibilities && job.responsibilities.length > 0 && (
                                                                            <ul>
                                                                                {job.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                                                                            </ul>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <span> N/A</span>
                                                            )}
                                                        </div>
                                                        {/* Always show Certifications section */}
                                                        <div className="summary-section compact-section">
                                                            <h4>Certifications:</h4>
                                                            {mappedCerts && mappedCerts.length > 0 ? (
                                                                <ul>
                                                                    {mappedCerts.map((cert, index) => (
                                                                        <li key={index}>{cert.name}{cert.issuer ? ` by ${cert.issuer}` : ''}{cert.date ? ` (${cert.date})` : ''}</li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <span> N/A</span>
                                                            )}
                                                        </div>
                                                        {/* Fallback if no specific summary data is found */}
                                                        {(!summary.name && !summary.email && !summary.phone &&
                                                        (!mappedWork || mappedWork.length === 0) &&
                                                        (!mappedProjects || mappedProjects.length === 0) &&
                                                        (!mappedCerts || mappedCerts.length === 0)) && (
                                                            <p>No detailed summary data extracted. This may happen if the resume format is highly unstructured.</p>
                                                        )}
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div className="summary-error">No summary available. Please analyze a resume first.</div>
                                        )
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <Sidebar onNavigate={handleNavigation} />
            {renderPage()}
        </>
    );
}

export default App;