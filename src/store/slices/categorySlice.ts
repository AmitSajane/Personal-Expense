import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [
    // Income categories
    { id: 'salary', name: 'Salary', color: '#4CAF50', icon: 'briefcase', type: 'income' },
    { id: 'freelance', name: 'Freelance', color: '#2196F3', icon: 'code', type: 'income' },
    { id: 'investment', name: 'Investment', color: '#9C27B0', icon: 'trending-up', type: 'income' },
    { id: 'other-income', name: 'Other Income', color: '#00BCD4', icon: 'plus-circle', type: 'income' },
    
    // Expense categories
    { id: 'food', name: 'Food', color: '#FF9800', icon: 'restaurant', type: 'expense' },
    { id: 'transport', name: 'Transport', color: '#607D8B', icon: 'car', type: 'expense' },
    { id: 'entertainment', name: 'Entertainment', color: '#E91E63', icon: 'film', type: 'expense' },
    { id: 'shopping', name: 'Shopping', color: '#795548', icon: 'shopping-bag', type: 'expense' },
    { id: 'healthcare', name: 'Healthcare', color: '#F44336', icon: 'heart', type: 'expense' },
    { id: 'education', name: 'Education', color: '#3F51B5', icon: 'book', type: 'expense' },
    { id: 'utilities', name: 'Utilities', color: '#009688', icon: 'home', type: 'expense' },
    { id: 'other-expense', name: 'Other Expense', color: '#9E9E9E', icon: 'minus-circle', type: 'expense' },
  ],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { addCategory, updateCategory, deleteCategory, clearError } = categorySlice.actions;
export default categorySlice.reducer;
