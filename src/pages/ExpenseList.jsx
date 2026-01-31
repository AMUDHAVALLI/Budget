import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CategoryIcon from '../components/CategoryIcon';
import { expensesAPI } from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import './ExpenseList.css';

const ExpenseList = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const response = await expensesAPI.getAll();
            setExpenses(response.data.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            alert('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        try {
            await expensesAPI.delete(id);
            setExpenses(expenses.filter(exp => exp.id !== id));
            alert('Expense deleted successfully');
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert('Failed to delete expense');
        }
    };

    return (
        <Layout title="Expenses" showBack>
            <div className="expense-list-container fade-in">
                <button
                    className="btn btn-primary add-btn"
                    onClick={() => navigate('/add-expense')}
                >
                    ➕ Add Expense
                </button>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="empty-state card">
                        <div className="empty-icon">📭</div>
                        <h3>No expenses yet</h3>
                        <p>Start tracking your expenses by adding your first one!</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/add-expense')}
                        >
                            Add Expense
                        </button>
                    </div>
                ) : (
                    <div className="expenses-list">
                        {expenses.map(expense => (
                            <div key={expense.id} className="expense-item card">
                                <div className="expense-item-content">
                                    <CategoryIcon
                                        icon={expense.category.icon}
                                        color={expense.category.color}
                                        size="md"
                                    />
                                    <div className="expense-details">
                                        <h3 className="expense-category">{expense.category.name}</h3>
                                        <p className="expense-date">{formatDate(expense.date)}</p>
                                        {expense.description && (
                                            <p className="expense-description">{expense.description}</p>
                                        )}
                                    </div>
                                    <div className="expense-amount-section">
                                        <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(expense.id)}
                                            aria-label="Delete expense"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ExpenseList;
