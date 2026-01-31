import Category from '../models/Category.js';

const categories = [
  {
    name: 'Food',
    icon: '🍴',
    color: '#10b981',
  },
  {
    name: 'Transport',
    icon: '🚗',
    color: '#3b82f6',
  },
  {
    name: 'Shopping',
    icon: '🛍️',
    color: '#ec4899',
  },
  {
    name: 'Utilities',
    icon: '💡',
    color: '#f59e0b',
  },
];

export const seedCategories = async () => {
  try {
    const existingCategories = await Category.count();
    
    if (existingCategories === 0) {
      await Category.bulkCreate(categories);
      console.log('✅ Categories seeded successfully.');
    } else {
      console.log('ℹ️  Categories already exist, skipping seed.');
    }
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
};

export default seedCategories;
