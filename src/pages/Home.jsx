import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ActionCard from '../components/ActionCard';
import { analyticsAPI } from '../utils/api';
import { formatCurrency } from '../utils/formatters';
import './Home.css';

const Home = () => {
    const [currentMonthData, setCurrentMonthData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurrentMonthData();
    }, []);

    const fetchCurrentMonthData = async () => {
        try {
            setLoading(true);
            const response = await analyticsAPI.getCurrentMonth();
            setCurrentMonthData(response.data.data);
        } catch (error) {
            console.error('Error fetching current month data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Expense Tracker">
            <div className="home-container fade-in">
                <div className="month-total-card glass">
                    <h2 className="month-label">This Month</h2>
                    {loading ? (
                        <div className="spinner"></div>
                    ) : (
                        <div className="month-total">{formatCurrency(currentMonthData?.total || 0)}</div>
                    )}
                </div>

                <div className="actions-grid">
                    <ActionCard
                        title="Add Expense"
                        icon="➕"
                        to="/add-expense"
                        color="#7c3aed"
                    />
                    <ActionCard
                        title="View Expenses"
                        icon="📋"
                        to="/expenses"
                        color="#10b981"
                    />
                    <ActionCard
                        title="Analytics"
                        icon="📊"
                        to="/analytics"
                        color="#ec4899"
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Home;
