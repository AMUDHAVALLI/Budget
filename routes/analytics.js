import express from 'express';
import Expense from '../models/Expense.js';
import Category from '../models/Category.js';
import { Op, fn, col, literal } from 'sequelize';
import sequelize from '../config/database.js';

const router = express.Router();

// GET /api/analytics/current-month - Get current month total
router.get('/current-month', async (req, res) => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const total = await Expense.sum('amount', {
      where: {
        date: {
          [Op.between]: [
            firstDay.toISOString().split('T')[0],
            lastDay.toISOString().split('T')[0],
          ],
        },
      },
    });
    
    res.json({
      success: true,
      data: {
        total: total || 0,
        month: now.toLocaleString('default', { month: 'long' }),
        year: now.getFullYear(),
      },
    });
  } catch (error) {
    console.error('Error fetching current month total:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current month total',
      error: error.message,
    });
  }
});

// GET /api/analytics/monthly - Get monthly expense totals
router.get('/monthly', async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year || new Date().getFullYear();
    
    const monthlyData = await Expense.findAll({
      attributes: [
        [fn('strftime', '%m', col('date')), 'month'],
        [fn('SUM', col('amount')), 'total'],
      ],
      where: {
        date: {
          [Op.between]: [
            `${targetYear}-01-01`,
            `${targetYear}-12-31`,
          ],
        },
      },
      group: [fn('strftime', '%m', col('date'))],
      order: [[fn('strftime', '%m', col('date')), 'ASC']],
      raw: true,
    });
    
    // Format data with month names
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedData = monthlyData.map(item => ({
      month: months[parseInt(item.month) - 1],
      monthNumber: parseInt(item.month),
      total: parseFloat(item.total) || 0,
    }));
    
    res.json({
      success: true,
      data: formattedData,
      year: targetYear,
    });
  } catch (error) {
    console.error('Error fetching monthly analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly analytics',
      error: error.message,
    });
  }
});

// GET /api/analytics/by-category - Get expenses grouped by category
router.get('/by-category', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where = {};
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }
    
    const categoryData = await Expense.findAll({
      attributes: [
        'categoryId',
        [fn('SUM', col('amount')), 'total'],
      ],
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'icon', 'color'],
      }],
      group: ['categoryId', 'category.id'],
      raw: false,
    });
    
    const formattedData = categoryData.map(item => ({
      categoryId: item.categoryId,
      categoryName: item.category.name,
      icon: item.category.icon,
      color: item.category.color,
      total: parseFloat(item.getDataValue('total')) || 0,
    }));
    
    res.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Error fetching category analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category analytics',
      error: error.message,
    });
  }
});

export default router;
