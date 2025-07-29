// src/components/InputField.js
import React from 'react';
import './InputField.css'; // Create this CSS file for input styling

function InputField({ label, type = 'text', value, onChange, isTextArea = false }) {
    return (
        <div className="input-field-group">
            <label>{label}</label>
            {isTextArea ? (
                <textarea value={value} onChange={onChange} rows="3"></textarea>
            ) : (
                <input type={type} value={value} onChange={onChange} />
            )}
        </div>
    );
}

export default InputField;