import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, CategorySummary } from '../../types';
import { transactionService } from '../../services/transactionService';

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  categorySummary: CategorySummary;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  categorySummary: {},
};

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params: { page?: number; limit?: number } = {}) => {
    const response = await transactionService.getTransactions(params);
    return response.data;
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await transactionService.createTransaction(transaction);
    return response.data;
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, ...updates }: Partial<Transaction> & { id: string }) => {
    const response = await transactionService.updateTransaction(id, updates);
    return response.data;
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: string) => {
    await transactionService.deleteTransaction(id);
    return id;
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    calculateCategorySummary: (state) => {
      const summary: CategorySummary = {};
      state.transactions.forEach((transaction) => {
        if (transaction.type === 'expense') {
          summary[transaction.category] = (summary[transaction.category] || 0) + transaction.amount;
        }
      });
      state.categorySummary = summary;
    },
    sortTransactionsByDate: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.transactions.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return action.payload === 'desc' ? dateB - dateA : dateA - dateB;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      // Add transaction
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add transaction';
      })
      // Update transaction
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update transaction';
      })
      // Delete transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete transaction';
      });
  },
});

export const { clearError, calculateCategorySummary, sortTransactionsByDate } = transactionSlice.actions;
export default transactionSlice.reducer;
