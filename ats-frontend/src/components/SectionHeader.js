// src/components/SectionHeader.js
import React from 'react';
import './SectionHeader.css'; // Create this CSS file

function SectionHeader({ title }) {
    return (
        <h3 className="form-section-header">{title}</h3>
    );
}

export default SectionHeader;