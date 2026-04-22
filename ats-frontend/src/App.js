import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ResumeBuilder from './components/ResumeBuilder';
import ResumeBuilderLanding from './components/ResumeBuilderLanding';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [activeTab, setActiveTab] = useState('analysis');
    const [displayedScore, setDisplayedScore] = useState(0);
    const [currentPage, setCurrentPage] = useState('ats-analyze');
    const [showResumeForm, setShowResumeForm] = useState(false);

    // Score animation
    useEffect(() => {
        if (analysisResults && analysisResults.analysis.overall_score !== undefined) {
            const finalScore = parseFloat(analysisResults.analysis.overall_score);
            setDisplayedScore(0);
            let current = 0;
            const increment = finalScore / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalScore) {
                    setDisplayedScore(finalScore);
                    clearInterval(timer);
                } else {
                    setDisplayedScore(parseFloat(current.toFixed(2)));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [analysisResults]);

    const handleNavigation = (page) => {
        setCurrentPage(page);
        if (page === 'ats-analyze') {
            setAnalysisResults(null);
            setSummary(null);
            setError('');
            setLoading(false);
            setSummaryLoading(false);
            setDisplayedScore(0);
            setActiveTab('analysis');
        }
        if (page !== 'resume-builder') {
            setShowResumeForm(false);
        }
    };

    const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setSelectedFile(event.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setDragActive(false); };
    const handleDescriptionChange = (e) => setJobDescription(e.target.value);

    const handleAnalyze = async () => {
        if (!selectedFile) { setError('Please select a resume file.'); return; }
        setError('');
        setAnalysisResults(null);
        setSummary(null);
        setDisplayedScore(0);
        setLoading(true);
        setActiveTab('analysis');
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('job_description', jobDescription);
        try {
            const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 60000,
            });
            setAnalysisResults(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error analyzing resume:', err);
            setError('Failed to analyze resume. Please try again.');
            setLoading(false);
        }
    };

    const handleSummary = async () => {
        if (!selectedFile) { setError('Please select a resume file.'); return; }
        setError('');
        setSummaryLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const response = await axios.post(`${API_BASE_URL}/resume_summary`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 60000,
            });
            setSummary(response.data.summary);
            setSummaryLoading(false);
        } catch (err) {
            console.error('Error getting summary:', err);
            setError('Failed to get summary. Please try again.');
            setSummaryLoading(false);
        }
    };

    // ── Render helpers ────────────────────────────────────────
    const renderContactRow = (label, value, isLink = false) => {
        if (!value) return null;
        return (
            <div className="contact-row">
                <span className="contact-label">{label}</span>
                {isLink ? (
                    <a className="contact-value" href={value.startsWith('http') ? value : `https://${value}`}
                        target="_blank" rel="noopener noreferrer">{value}</a>
                ) : (
                    <span className="contact-value">{value}</span>
                )}
            </div>
        );
    };

    const renderSummaryTab = () => {
        if (summaryLoading) {
            return (
                <div className="loading-content">
                    <div className="spinner"></div>
                    Loading summary…
                </div>
            );
        }
        if (!summary) {
            return <div className="error-content">No summary available. Please analyze a resume first.</div>;
        }

        // Helper to structure section strings into heading + bullets
        const formatSectionItems = (data) => {
            if (!Array.isArray(data)) return [];
            const result = [];
            let currentItem = null;

            data.forEach(item => {
                if (typeof item === 'object') {
                    // Normalize object structure safely
                    result.push({
                        title: item.title || item.name || '',
                        bullets: item.responsibilities || item.description || item.bullets || []
                    });
                    return;
                }
                const text = typeof item === 'string' ? item.trim() : '';
                if (!text) return;

                // Detect bullets (starts with symbols, 'o ', or very long paragraph)
                const isBullet = /^[-•*›>·]\s*/.test(text) || text.startsWith('o ') || text.length > 80;

                if (isBullet) {
                    let cleanText = text.replace(/^[-•*›>·]\s*/, '').replace(/^o\s+/, '');
                    if (!currentItem) {
                        currentItem = { title: '', bullets: [] };
                        result.push(currentItem);
                    }
                    if (!currentItem.bullets) currentItem.bullets = [];
                    currentItem.bullets.push(cleanText);
                } else {
                    currentItem = { title: text, bullets: [] };
                    result.push(currentItem);
                }
            });
            return result;
        };

        const mappedWork = formatSectionItems(summary.work_experience);
        const mappedProjects = formatSectionItems(summary.projects);
        const mappedCerts = formatSectionItems(summary.certifications);

        return (
            <div className="summary-display-area">
                <h3 className="results-title">
                    Resume Summary
                    <span className="results-subtitle">{summary.name || analysisResults?.filename || ''}</span>
                </h3>

                {/* Contact Info */}
                <div className="summary-section">
                    <h4>Contact Information</h4>
                    {renderContactRow('Name', summary.name)}
                    {renderContactRow('Email', summary.email)}
                    {renderContactRow('Phone', summary.phone)}
                    {renderContactRow('LinkedIn', summary.linkedin, true)}
                    {renderContactRow('GitHub', summary.github, true)}
                    {renderContactRow('Portfolio', summary.portfolio, true)}
                    {!summary.name && !summary.email && !summary.phone && (
                        <span className="na-text">No contact details found.</span>
                    )}
                </div>

                {/* Work Experience */}
                <div className="summary-section">
                    <h4>Work Experience</h4>
                    {mappedWork.length > 0 ? (
                        mappedWork.map((job, i) => (
                            <div key={i} className="summary-item">
                                {job.title && <strong>{job.title}</strong>}
                                {job.bullets && job.bullets.length > 0 && (
                                    <ul>{job.bullets.map((r, j) => <li key={j}>{r}</li>)}</ul>
                                )}
                            </div>
                        ))
                    ) : (
                        <span className="na-text">No work experience found.</span>
                    )}
                </div>

                {/* Projects */}
                {mappedProjects.length > 0 && (
                    <div className="summary-section">
                        <h4>Projects</h4>
                        {mappedProjects.map((proj, i) => {
                            const cleanTitle = proj.title ? proj.title.replace(/\s*link$/i, '') : '';
                            return (
                                <div key={i} className="summary-item">
                                    {cleanTitle && <strong>{cleanTitle}</strong>}
                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul>{proj.bullets.map((r, j) => <li key={j}>{r}</li>)}</ul>
                                    )}
                                </div>
                            );
                        })}
                        {summary.tech_stack && summary.tech_stack.length > 0 && (
                            <div className="summary-tech-stack">
                                <span className="tech-label">Tech Stack:</span>
                                {summary.tech_stack.map((t, i) => (
                                    <span key={i} className="tech-pill">{t}</span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Certifications */}
                <div className="summary-section">
                    <h4>Certifications</h4>
                    {mappedCerts.length > 0 ? (
                        mappedCerts.map((cert, i) => (
                            <div key={i} className="summary-item">
                                {cert.title && <strong>{cert.title}</strong>}
                                {cert.bullets && cert.bullets.length > 0 && (
                                    <ul>{cert.bullets.map((r, j) => <li key={j}>{r}</li>)}</ul>
                                )}
                            </div>
                        ))
                    ) : (
                        <span className="na-text">No certifications found.</span>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button className="btn-ghost" onClick={() => handleNavigation('ats-analyze')}>
                        ← Back to Analyzer
                    </button>
                </div>
            </div>
        );
    };

    const renderAnalysisTab = () => {
        if (!analysisResults) return null;
        const score = parseFloat(analysisResults.analysis.overall_score);
        return (
            <div className="results">
                <h3 className="results-title">
                    ATS Analysis
                    <span className="results-subtitle">{analysisResults.filename}</span>
                </h3>

                {/* Score Gauge */}
                <div className="score-gauge-container">
                    <div className="score-gauge" style={{ '--score-percentage': `${displayedScore}` }}>
                        <div className="score-bar"></div>
                        <div className="score-text">
                            {displayedScore.toFixed(0)}%
                            <span className="score-label">Match</span>
                        </div>
                    </div>
                    <div className="score-description">
                        <p>Your resume matches the job description by <strong>{analysisResults.analysis.overall_score}%</strong>.</p>
                        {score < 50 && (
                            <p className="suggestion low">Consider tailoring your resume more closely to the JD's requirements.</p>
                        )}
                        {score >= 50 && score < 75 && (
                            <p className="suggestion medium">A good start! Review missing skills for potential improvements.</p>
                        )}
                        {score >= 75 && (
                            <p className="suggestion high">Excellent match! You're a strong candidate for this role.</p>
                        )}
                    </div>
                </div>

                {/* Skills Comparison */}
                <div className="skills-comparison-section">
                    <p className="section-title">Skills Overview</p>
                    <div className="skills-columns">
                        <div className="skills-list match-skills">
                            <p className="skills-title">
                                <span className="icon-check">✔</span> Matching Skills
                            </p>
                            {analysisResults.analysis.matching_skills && analysisResults.analysis.matching_skills.length > 0 ? (
                                <ul>
                                    {analysisResults.analysis.matching_skills.map((skill, i) => (
                                        <li key={i} className="skill-item match">{skill}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="na-text">No direct matches found.</span>
                            )}
                        </div>
                        <div className="skills-list miss-skills">
                            <p className="skills-title">
                                <span className="icon-cross">✖</span> Missing Skills
                            </p>
                            {analysisResults.analysis.missing_skills && analysisResults.analysis.missing_skills.length > 0 ? (
                                <ul>
                                    {analysisResults.analysis.missing_skills.map((skill, i) => (
                                        <li key={i} className="skill-item miss">{skill}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="na-text">No critical gaps identified.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Other details */}
                {analysisResults.analysis.sections_found && analysisResults.analysis.sections_found.length > 0 && (
                    <div className="analysis-detail-section">
                        <h4>Sections Found</h4>
                        <p>{analysisResults.analysis.sections_found.join(', ')}</p>
                    </div>
                )}
                {analysisResults.analysis.action_verbs_found && analysisResults.analysis.action_verbs_found.length > 0 && (
                    <div className="analysis-detail-section">
                        <h4>Action Verbs Found</h4>
                        <p>{analysisResults.analysis.action_verbs_found.join(', ')}</p>
                    </div>
                )}
                {analysisResults.analysis.extra_skills && analysisResults.analysis.extra_skills.length > 0 && (
                    <div className="analysis-detail-section">
                        <h4>Extra Skills (Resume Only)</h4>
                        <p>{analysisResults.analysis.extra_skills.join(', ')}</p>
                    </div>
                )}
                {analysisResults.analysis.resume_skills && (
                    <details className="debug-skills-details">
                        <summary>Extracted Resume Skills (debug)</summary>
                        <p>{analysisResults.analysis.resume_skills.join(', ')}</p>
                    </details>
                )}
            </div>
        );
    };

    // ── Page Router ───────────────────────────────────────────
    const renderPage = () => {
        switch (currentPage) {
            case 'resume-builder':
                return showResumeForm ? (
                    <ResumeBuilder onBackToLanding={() => setShowResumeForm(false)} />
                ) : (
                    <ResumeBuilderLanding onStartBuilder={() => setShowResumeForm(true)} />
                );

            case 'ats-analyze':
            default:
                // ── Landing / upload screen ───────────────────────────
                if (!analysisResults && !loading) {
                    return (
                        <div className="App initial-screen">
                            <h1 className="ats-heading">ATS Resume Checker</h1>

                            {/* Dropzone */}
                            <div
                                className={`dropzone${dragActive ? ' dragover' : ''}`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                {selectedFile ? (
                                    <span className="dropzone-filename">📄 {selectedFile.name}</span>
                                ) : (
                                    <span>Drag &amp; Drop your resume here, or <u>click to browse</u></span>
                                )}
                            </div>

                            <label htmlFor="jobDescription">Paste Job Description:</label>
                            <textarea
                                id="jobDescription"
                                rows="5"
                                cols="50"
                                value={jobDescription}
                                onChange={handleDescriptionChange}
                                placeholder="Paste the job description here…"
                            />

                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
                                <button onClick={handleAnalyze} disabled={loading}>
                                    {loading ? 'Analyzing...' : 'Analyze Resume'}
                                </button>
                                <button onClick={() => handleNavigation('resume-builder')}>
                                    Resume Builder
                                </button>
                            </div>

                            {error && <p className="error">{error}</p>}
                        </div>
                    );
                }

                // ── Results screen ────────────────────────────────────
                return (
                    <div className="analyze-page-bg">
                        {/* Top bar */}
                        <div className="app-topbar">
                            <span className="topbar-brand">ATS Resume Checker</span>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span className="topbar-filename">{analysisResults?.filename}</span>
                                <button className="btn-ghost" onClick={() => handleNavigation('ats-analyze')}>
                                    ← New Analysis
                                </button>
                                <button className="btn-ghost" onClick={() => handleNavigation('resume-builder')}>
                                    ✏ Builder
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
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
                                    if (!summary && !summaryLoading) {
                                        await handleSummary();
                                    }
                                }}
                            >
                                Resume Summary
                            </div>
                        </div>

                        {/* Content */}
                        <div className="tab-content">
                            {loading ? (
                                <div className="loading-content">
                                    <div className="spinner"></div>
                                    Analyzing your resume…
                                </div>
                            ) : error ? (
                                <div className="error-content">{error}</div>
                            ) : (
                                <>
                                    {activeTab === 'analysis' && renderAnalysisTab()}
                                    {activeTab === 'summary' && renderSummaryTab()}
                                </>
                            )}
                        </div>
                    </div>
                );
        }
    };

    return <>{renderPage()}</>;
}

export default App;
