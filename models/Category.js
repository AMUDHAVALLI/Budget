import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Emoji or icon identifier',
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Hex color code for UI display',
  },
}, {
  tableName: 'categories',
  timestamps: true,
});

export default Category;
