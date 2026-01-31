import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddExpense from './pages/AddExpense';
import ExpenseList from './pages/ExpenseList';
import Analytics from './pages/Analytics';
import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add-expense" element={<AddExpense />} />
                <Route path="/expenses" element={<ExpenseList />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
        </Router>
    );
}

export default App;
