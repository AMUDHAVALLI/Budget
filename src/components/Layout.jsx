import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children, title, showBack = false }) => {
    const navigate = useNavigate();

    return (
        <div className="layout">
            <header className="header glass">
                <div className="header-content">
                    {showBack && (
                        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                            ←
                        </button>
                    )}
                    <h1 className="header-title">{title}</h1>
                </div>
            </header>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
