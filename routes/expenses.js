import express from 'express';
import Expense from '../models/Expense.js';
import Category from '../models/Category.js';
import { Op } from 'sequelize';

const router = express.Router();

// GET /api/expenses - Get all expenses with optional filtering
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, categoryId } = req.query;
    
    const where = {};
    
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    const expenses = await Expense.findAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'icon', 'color'],
      }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
    });
    
    res.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses',
      error: error.message,
    });
  }
});

// POST /api/expenses - Create new expense
router.post('/', async (req, res) => {
  try {
    const { amount, categoryId, date, description } = req.body;
    
    // Validation
    if (!amount || !categoryId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Amount, category, and date are required',
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0',
      });
    }
    
    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    
    const expense = await Expense.create({
      amount,
      categoryId,
      date,
      description,
    });
    
    // Fetch the created expense with category details
    const createdExpense = await Expense.findByPk(expense.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'icon', 'color'],
      }],
    });
    
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: createdExpense,
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create expense',
      error: error.message,
    });
  }
});

// PUT /api/expenses/:id - Update expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, categoryId, date, description } = req.body;
    
    const expense = await Expense.findByPk(id);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }
    
    // Validation
    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0',
      });
    }
    
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
    }
    
    await expense.update({
      amount: amount !== undefined ? amount : expense.amount,
      categoryId: categoryId || expense.categoryId,
      date: date || expense.date,
      description: description !== undefined ? description : expense.description,
    });
    
    // Fetch updated expense with category details
    const updatedExpense = await Expense.findByPk(id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'icon', 'color'],
      }],
    });
    
    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense,
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update expense',
      error: error.message,
    });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const expense = await Expense.findByPk(id);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }
    
    await expense.destroy();
    
    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message,
    });
  }
});

export default router;
