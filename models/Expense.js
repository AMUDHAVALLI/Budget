import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Category from './Category.js';

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'expenses',
  timestamps: true,
});

// Define relationships
Expense.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Expense, { foreignKey: 'categoryId', as: 'expenses' });

export default Expense;
