import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

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
        setSummary(null);
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

    // Initial screen (centered, pastel bg)
    if (!analysisResults) {
    return (
        <div className="App">
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
                    Analysis
                </div>
                <div
                    className={`tab${activeTab === 'summary' ? ' active' : ''}`}
                    onClick={async () => {
                        setActiveTab('summary');
                        if (!summary && !summaryLoading) await handleSummary();
                    }}
                >
                    Resume Summary
                </div>
            </div>
            <div className="tab-content">
                {activeTab === 'analysis' && analysisResults && (
                <div className="results">
                    <h3>Analysis Results for {analysisResults.filename}</h3>
                    {analysisResults.analysis.overall_score && (
                        <div>
                            <h4>Overall Matching Score:</h4>
                            <p>{analysisResults.analysis.overall_score}</p>
                        </div>
                    )}
                    {analysisResults.analysis.semantic_similarity_score && (
                        <div>
                            <h4>Semantic Similarity Score:</h4>
                            <p>{analysisResults.analysis.semantic_similarity_score}</p>
                        </div>
                    )}
                    {analysisResults.analysis.matching_skills && analysisResults.analysis.matching_skills.length > 0 && (
                        <div>
                            <h4>Matching Skills:</h4>
                            <p>{analysisResults.analysis.matching_skills.join(', ')}</p>
                        </div>
                    )}
                    {analysisResults.analysis.missing_skills && analysisResults.analysis.missing_skills.length > 0 && (
                        <div>
                            <h4>Missing Skills:</h4>
                            <p>{analysisResults.analysis.missing_skills.join(', ')}</p>
                        </div>
                    )}
                    {analysisResults.analysis.sections_found && analysisResults.analysis.sections_found.length > 0 && (
                        <div>
                            <h4>Sections Found:</h4>
                            <p>{analysisResults.analysis.sections_found.join(', ')}</p>
                        </div>
                    )}
                    {analysisResults.analysis.action_verbs_found && analysisResults.analysis.action_verbs_found.length > 0 && (
                        <div>
                            <h4>Action Verbs Found:</h4>
                            <p>{analysisResults.analysis.action_verbs_found.join(', ')}</p>
                        </div>
                    )}
                    {analysisResults.analysis.extra_skills && analysisResults.analysis.extra_skills.length > 0 && (
                        <div>
                            <h4>Extra Skills (Resume Only):</h4>
                            <p>{analysisResults.analysis.extra_skills.join(', ')}</p>
                        </div>
                    )}
                    {analysisResults.analysis.resume_skills && (
                        <details>
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
                <div className="summary">
                            <h2 style={{ textAlign: 'left', marginBottom: '20px' }}>Resume Summary</h2>
                            <div style={{ textAlign: 'left', maxWidth: '700px' }}>
                    <p><strong>Name:</strong> {summary.name || 'N/A'}</p>
                                <p><strong>Email:</strong> {summary.email && summary.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/) ? summary.email : 'N/A'}</p>
                    <p><strong>Phone:</strong> {summary.phone || 'N/A'}</p>
                    <p><strong>Address:</strong> {summary.address || 'N/A'}</p>
                                <div style={{ marginTop: '20px' }}>
                                    <strong style={{ fontSize: '18px' }}>Projects:</strong>
                                    {Array.isArray(summary.projects) && summary.projects.length > 0 ? (
                                        <div style={{ marginLeft: '10px' }}>
                                            {summary.projects.map((proj, idx) => {
                                                let name = proj;
                                                let details = '';
                                                const dashIdx = proj.indexOf(' - ');
                                                const colonIdx = proj.indexOf(': ');
                                                if (dashIdx > 0) {
                                                    name = proj.slice(0, dashIdx);
                                                    details = proj.slice(dashIdx + 3);
                                                } else if (colonIdx > 0) {
                                                    name = proj.slice(0, colonIdx);
                                                    details = proj.slice(colonIdx + 2);
                                                }
                                                name = name.replace(/\s*Link\s*$/i, '');
                                                if (name.trim().toLowerCase() === 'projects' || !name.trim()) return null;
                                                return (
                                                    <div key={idx} style={{ marginBottom: details ? '0' : '10px' }}>
                                                        <div style={{ fontWeight: 'bold', color: 'black', marginTop: '10px' }}>{name.trim()}</div>
                                                        {details && details.split(/\.|,/).filter(pt => pt.trim().length > 2).map((pt, i) => (
                                                            <div key={i} style={{ fontWeight: 400, fontFamily: 'inherit', color: 'black', marginLeft: '18px', marginTop: '2px' }}>{pt.trim()}</div>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : ' N/A'}
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <strong>Tech Stack:</strong> {summary.tech_stack && summary.tech_stack.length > 0 ? summary.tech_stack.join(', ') : 'N/A'}
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <strong>Work Experience:</strong> {summary.work_experience && summary.work_experience.length > 0 ? summary.work_experience.join(', ') : 'N/A'}
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <strong>Certifications:</strong> {summary.certifications && summary.certifications.length > 0 ? summary.certifications.join(', ') : 'N/A'}
                                </div>
                            </div>
                </div>
                    ) : (
                        <div className="summary-error">No summary available.</div>
                    )
            )}
            </div>
        </div>
    );
}
export default App;