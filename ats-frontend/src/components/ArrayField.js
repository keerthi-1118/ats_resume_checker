// src/components/ArrayField.js
import React from 'react';
import './ArrayField.css'; // Create this CSS file for array field styling

function ArrayField({ items, sectionName, defaultItem, onAddItem, onRemoveItem, renderItem, title = null, isNested = false }) {
    return (
        <div className={`array-field-container ${isNested ? 'nested-array-field' : ''}`}>
            {title && <h4>{title}</h4>}
            {items.map((item, index) => (
                <div key={index} className="array-item-wrapper">
                    {renderItem({ item, index })}
                    {items.length > 1 && (
                        <button type="button" onClick={() => onRemoveItem(index)} className="remove-item-btn">
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button type="button" onClick={() => onAddItem(sectionName, defaultItem)} className="add-item-btn">
                Add {title ? title.slice(0, -1) : 'Item'}
            </button>
        </div>
    );
}

export default ArrayField;