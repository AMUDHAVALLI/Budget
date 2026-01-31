import React from 'react';
import './CategoryIcon.css';

const CategoryIcon = ({ icon, color, size = 'md' }) => {
    return (
        <div
            className={`category-icon category-icon-${size}`}
            style={{ backgroundColor: color }}
        >
            <span className="category-icon-emoji">{icon}</span>
        </div>
    );
};

export default CategoryIcon;
