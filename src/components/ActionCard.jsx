import React from 'react';
import { Link } from 'react-router-dom';
import './ActionCard.css';

const ActionCard = ({ title, icon, to, color }) => {
    return (
        <Link to={to} className="action-card glass" style={{ '--card-color': color }}>
            <div className="action-card-icon" style={{ backgroundColor: color }}>
                {icon}
            </div>
            <h3 className="action-card-title">{title}</h3>
        </Link>
    );
};

export default ActionCard;
