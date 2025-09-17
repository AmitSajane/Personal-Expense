import { transactionService } from '../../services/transactionService';
import { storageService } from '../../services/storageService';
import { Transaction } from '../../types';

// Mock the storage service
jest.mock('../../services/storageService');
const mockStorageService = storageService as jest.Mocked<typeof storageService>;

// Mock axios
jest.mock('axios');
const mockAxios = require('axios');

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactions', () => {
    it('should fetch transactions from API successfully', async () => {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          amount: 100,
          category: 'Food',
          description: 'Lunch',
          type: 'expense',
          date: new Date('2024-01-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockAxios.mockResolvedValueOnce({
        data: mockTransactions,
      });

      const result = await transactionService.getTransactions({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTransactions);
      expect(mockAxios).toHaveBeenCalledWith({
        url: 'https://api.personalfinance.app/transactions?page=1&limit=10',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
    });

    it('should fallback to local storage when API fails', async () => {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          amount: 100,
          category: 'Food',
          description: 'Lunch',
          type: 'expense',
          date: new Date('2024-01-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockAxios.mockRejectedValueOnce(new Error('Network error'));
      mockStorageService.getTransactions.mockResolvedValueOnce(mockTransactions);

      const result = await transactionService.getTransactions();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTransactions);
      expect(mockStorageService.getTransactions).toHaveBeenCalled();
    });
  });

  describe('createTransaction', () => {
    it('should create transaction successfully', async () => {
      const newTransaction = {
        amount: 100,
        category: 'Food',
        description: 'Lunch',
        type: 'expense' as const,
        date: new Date('2024-01-01'),
      };

      const createdTransaction: Transaction = {
        ...newTransaction,
        id: 'generated-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAxios.mockResolvedValueOnce({
        data: createdTransaction,
      });
      mockStorageService.saveTransaction.mockResolvedValueOnce(undefined);

      const result = await transactionService.createTransaction(newTransaction);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdTransaction);
      expect(mockStorageService.saveTransaction).toHaveBeenCalledWith(createdTransaction);
    });

    it('should fallback to local storage when API fails', async () => {
      const newTransaction = {
        amount: 100,
        category: 'Food',
        description: 'Lunch',
        type: 'expense' as const,
        date: new Date('2024-01-01'),
      };

      mockAxios.mockRejectedValueOnce(new Error('Network error'));
      mockStorageService.saveTransaction.mockResolvedValueOnce(undefined);

      const result = await transactionService.createTransaction(newTransaction);

      expect(result.success).toBe(true);
      expect(result.data.amount).toBe(newTransaction.amount);
      expect(result.data.category).toBe(newTransaction.category);
      expect(mockStorageService.saveTransaction).toHaveBeenCalled();
    });
  });

  describe('updateTransaction', () => {
    it('should update transaction successfully', async () => {
      const transactionId = '1';
      const updates = { amount: 150, description: 'Updated lunch' };
      
      const updatedTransaction: Transaction = {
        id: transactionId,
        amount: 150,
        category: 'Food',
        description: 'Updated lunch',
        type: 'expense',
        date: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAxios.mockResolvedValueOnce({
        data: updatedTransaction,
      });
      mockStorageService.updateTransaction.mockResolvedValueOnce(undefined);

      const result = await transactionService.updateTransaction(transactionId, updates);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedTransaction);
      expect(mockStorageService.updateTransaction).toHaveBeenCalledWith(transactionId, updatedTransaction);
    });
  });

  describe('deleteTransaction', () => {
    it('should delete transaction successfully', async () => {
      const transactionId = '1';

      mockAxios.mockResolvedValueOnce({});
      mockStorageService.deleteTransaction.mockResolvedValueOnce(undefined);

      const result = await transactionService.deleteTransaction(transactionId);

      expect(result.success).toBe(true);
      expect(mockStorageService.deleteTransaction).toHaveBeenCalledWith(transactionId);
    });

    it('should fallback to local storage when API fails', async () => {
      const transactionId = '1';

      mockAxios.mockRejectedValueOnce(new Error('Network error'));
      mockStorageService.deleteTransaction.mockResolvedValueOnce(undefined);

      const result = await transactionService.deleteTransaction(transactionId);

      expect(result.success).toBe(true);
      expect(mockStorageService.deleteTransaction).toHaveBeenCalledWith(transactionId);
    });
  });
});
