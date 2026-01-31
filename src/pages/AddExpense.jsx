import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CategoryIcon from '../components/CategoryIcon';
import { categoriesAPI, expensesAPI } from '../utils/api';
import { getCurrentDate } from '../utils/formatters';
import './AddExpense.css';

const AddExpense = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        categoryId: '',
        date: getCurrentDate(),
        description: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAll();
            setCategories(response.data.data);
            if (response.data.data.length > 0) {
                setFormData(prev => ({ ...prev, categoryId: response.data.data[0].id }));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('Failed to load categories');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.amount || !formData.categoryId || !formData.date) {
            alert('Please fill in all required fields');
            return;
        }

        if (parseFloat(formData.amount) <= 0) {
            alert('Amount must be greater than 0');
            return;
        }

        try {
            setLoading(true);
            await expensesAPI.create({
                amount: parseFloat(formData.amount),
                categoryId: parseInt(formData.categoryId),
                date: formData.date,
                description: formData.description,
            });

            alert('Expense added successfully!');
            navigate('/expenses');
        } catch (error) {
            console.error('Error creating expense:', error);
            alert('Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const selectedCategory = categories.find(cat => cat.id === parseInt(formData.categoryId));

    return (
        <Layout title="Add Expense" showBack>
            <div className="add-expense-container fade-in">
                <form onSubmit={handleSubmit} className="expense-form card">
                    <div className="form-group">
                        <label htmlFor="amount" className="form-label">Amount</label>
                        <div className="amount-input-wrapper">
                            <span className="currency-symbol">₹</span>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                className="form-input amount-input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="categoryId" className="form-label">Category</label>
                        <div className="category-select-wrapper">
                            {selectedCategory && (
                                <CategoryIcon
                                    icon={selectedCategory.icon}
                                    color={selectedCategory.color}
                                    size="sm"
                                />
                            )}
                            <select
                                id="categoryId"
                                name="categoryId"
                                className="form-select category-select"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.icon} {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="date" className="form-label">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            className="form-input"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-textarea"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default AddExpense;
