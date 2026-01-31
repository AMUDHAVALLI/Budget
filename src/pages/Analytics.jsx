import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { analyticsAPI } from '../utils/api';
import { formatCurrency } from '../utils/formatters';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Analytics.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [monthlyResponse, categoryResponse] = await Promise.all([
                analyticsAPI.getMonthly(),
                analyticsAPI.getByCategory(),
            ]);

            setMonthlyData(monthlyResponse.data.data);
            setCategoryData(categoryResponse.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            alert('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    // Bar chart data for monthly expenses
    const barChartData = {
        labels: monthlyData.map(item => item.month),
        datasets: [
            {
                label: 'Monthly Expenses',
                data: monthlyData.map(item => item.total),
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#9C27B0',
                    '#FFC107',
                    '#F44336',
                    '#00BCD4',
                    '#FF9800',
                    '#E91E63',
                    '#3F51B5',
                    '#8BC34A',
                    '#FF5722',
                    '#009688',
                ],
                borderRadius: 8,
                borderWidth: 0,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => formatCurrency(context.parsed.y),
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `₹${value.toLocaleString()}`,
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    // Doughnut chart data for category breakdown
    const doughnutChartData = {
        labels: categoryData.map(item => item.categoryName),
        datasets: [
            {
                data: categoryData.map(item => item.total),
                backgroundColor: categoryData.map(item => item.color),
                borderWidth: 0,
                spacing: 2,
            },
        ],
    };

    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = formatCurrency(context.parsed);
                        return `${label}: ${value}`;
                    },
                },
            },
        },
        cutout: '65%',
    };

    return (
        <Layout title="Analytics" showBack>
            <div className="analytics-container fade-in">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        {/* Monthly Expenses Bar Chart */}
                        <div className="chart-section card">
                            <h2 className="chart-title">Expenses</h2>
                            <div className="chart-wrapper bar-chart-wrapper">
                                {monthlyData.length > 0 ? (
                                    <Bar data={barChartData} options={barChartOptions} />
                                ) : (
                                    <div className="no-data">No monthly data available</div>
                                )}
                            </div>
                        </div>

                        {/* Category Breakdown Doughnut Chart */}
                        <div className="chart-section card">
                            <h2 className="chart-title">Expenses by Category</h2>
                            <div className="category-chart-container">
                                <div className="chart-wrapper doughnut-chart-wrapper">
                                    {categoryData.length > 0 ? (
                                        <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                                    ) : (
                                        <div className="no-data">No category data available</div>
                                    )}
                                </div>

                                {categoryData.length > 0 && (
                                    <div className="category-legend">
                                        {categoryData.map(item => (
                                            <div key={item.categoryId} className="legend-item">
                                                <div
                                                    className="legend-color"
                                                    style={{ backgroundColor: item.color }}
                                                >
                                                    {item.icon}
                                                </div>
                                                <div className="legend-details">
                                                    <span className="legend-name">{item.categoryName}</span>
                                                    <span className="legend-amount">{formatCurrency(item.total)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Analytics;
