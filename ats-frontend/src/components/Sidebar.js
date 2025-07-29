import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigation = (page) => {
        onNavigate(page);
        setIsOpen(false); // Close sidebar after navigation
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                <span className="hamburger"></span>
                <span className="hamburger"></span>
                <span className="hamburger"></span>
            </button>
            
            <div className="sidebar-content">
                <div className="sidebar-header">
                    <h3>ATS Tools</h3>
                </div>
                
                <nav className="sidebar-nav">
                    <button 
                        className="nav-button"
                        onClick={() => handleNavigation('ats-analyze')}
                    >
                        <span className="nav-icon">📊</span>
                        <span className="nav-text">ATS Analyze</span>
                    </button>
                    
                    <button 
                        className="nav-button"
                        onClick={() => handleNavigation('resume-builder')}
                    >
                        <span className="nav-icon">📝</span>
                        <span className="nav-text">Resume Builder</span>
                    </button>
                    
                    <button 
                        className="nav-button"
                        onClick={() => handleNavigation('home')}
                    >
                        <span className="nav-icon">🏠</span>
                        <span className="nav-text">Back to Home</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;