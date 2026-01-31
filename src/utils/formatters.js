import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'MMMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return date;
  }
};

export const formatDateShort = (date) => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'MMM dd');
  } catch (error) {
    console.error('Error formatting date:', error);
    return date;
  }
};

export const formatDateInput = (date) => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date:', error);
    return date;
  }
};

export const getCurrentDate = () => {
  return format(new Date(), 'yyyy-MM-dd');
};
