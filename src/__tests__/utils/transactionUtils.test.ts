import {
  groupTransactionsByCategory,
  sortTransactionsByDate,
  calculateCompoundInterest,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetWorth,
  validateTransaction,
} from '../../utils/transactionUtils';
import { Transaction } from '../../types';

describe('Transaction Utils', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      amount: 50,
      category: 'Food',
      description: 'Lunch',
      type: 'expense',
      date: new Date('2024-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      amount: 30,
      category: 'Transport',
      description: 'Bus fare',
      type: 'expense',
      date: new Date('2024-01-02'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      amount: 20,
      category: 'Food',
      description: 'Coffee',
      type: 'expense',
      date: new Date('2024-01-03'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      amount: 1000,
      category: 'Salary',
      description: 'Monthly salary',
      type: 'income',
      date: new Date('2024-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  describe('groupTransactionsByCategory', () => {
    it('should group transactions by category and calculate totals', () => {
      const result = groupTransactionsByCategory(mockTransactions);
      
      expect(result).toEqual({
        Food: 70,
        Transport: 30,
      });
    });

    it('should return empty object for no transactions', () => {
      const result = groupTransactionsByCategory([]);
      expect(result).toEqual({});
    });

    it('should only include expense transactions', () => {
      const result = groupTransactionsByCategory(mockTransactions);
      expect(result.Salary).toBeUndefined();
    });
  });

  describe('sortTransactionsByDate', () => {
    it('should sort transactions by date in descending order by default', () => {
      const result = sortTransactionsByDate(mockTransactions);
      
      expect(result[0].id).toBe('3'); // Most recent
      expect(result[1].id).toBe('2');
      expect(result[2].id).toBe('1');
      expect(result[3].id).toBe('4'); // Oldest
    });

    it('should sort transactions by date in ascending order when specified', () => {
      const result = sortTransactionsByDate(mockTransactions, 'asc');
      
      expect(result[0].id).toBe('4'); // Oldest
      expect(result[1].id).toBe('1');
      expect(result[2].id).toBe('2');
      expect(result[3].id).toBe('3'); // Most recent
    });

    it('should not mutate original array', () => {
      const original = [...mockTransactions];
      sortTransactionsByDate(mockTransactions);
      
      expect(mockTransactions).toEqual(original);
    });
  });

  describe('calculateCompoundInterest', () => {
    it('should calculate compound interest correctly', () => {
      const principal = 1000;
      const rate = 0.05; // 5%
      const periods = 2;
      
      const result = calculateCompoundInterest(principal, rate, periods);
      
      // Year 1: 1000 + (1000 * 0.05) = 1050
      // Year 2: 1050 + (1050 * 0.05) = 1102.5
      expect(result).toBeCloseTo(1102.5, 2);
    });

    it('should return principal for 0 periods', () => {
      const result = calculateCompoundInterest(1000, 0.05, 0);
      expect(result).toBe(1000);
    });

    it('should handle zero interest rate', () => {
      const result = calculateCompoundInterest(1000, 0, 5);
      expect(result).toBe(1000);
    });
  });

  describe('calculateTotalIncome', () => {
    it('should calculate total income correctly', () => {
      const result = calculateTotalIncome(mockTransactions);
      expect(result).toBe(1000);
    });

    it('should return 0 for no income transactions', () => {
      const expensesOnly = mockTransactions.filter(t => t.type === 'expense');
      const result = calculateTotalIncome(expensesOnly);
      expect(result).toBe(0);
    });
  });

  describe('calculateTotalExpenses', () => {
    it('should calculate total expenses correctly', () => {
      const result = calculateTotalExpenses(mockTransactions);
      expect(result).toBe(100);
    });

    it('should return 0 for no expense transactions', () => {
      const incomeOnly = mockTransactions.filter(t => t.type === 'income');
      const result = calculateTotalExpenses(incomeOnly);
      expect(result).toBe(0);
    });
  });

  describe('calculateNetWorth', () => {
    it('should calculate net worth correctly', () => {
      const result = calculateNetWorth(mockTransactions);
      expect(result).toBe(900); // 1000 - 100
    });

    it('should handle negative net worth', () => {
      const highExpenses = [
        ...mockTransactions,
        {
          id: '5',
          amount: 2000,
          category: 'Rent',
          description: 'Monthly rent',
          type: 'expense',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      const result = calculateNetWorth(highExpenses);
      expect(result).toBe(-1100); // 1000 - 2100
    });
  });

  describe('validateTransaction', () => {
    it('should validate correct transaction', () => {
      const validTransaction = {
        amount: 100,
        category: 'Food',
        description: 'Lunch',
        type: 'expense' as const,
        date: new Date(),
      };
      
      const errors = validateTransaction(validTransaction);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for invalid transaction', () => {
      const invalidTransaction = {
        amount: -10,
        category: '',
        description: '',
        type: 'invalid' as any,
        date: null as any,
      };
      
      const errors = validateTransaction(invalidTransaction);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('Amount must be greater than 0');
      expect(errors).toContain('Category is required');
      expect(errors).toContain('Description is required');
      expect(errors).toContain('Type must be either income or expense');
      expect(errors).toContain('Date is required');
    });

    it('should validate amount greater than 0', () => {
      const transaction = {
        amount: 0,
        category: 'Food',
        description: 'Lunch',
        type: 'expense' as const,
        date: new Date(),
      };
      
      const errors = validateTransaction(transaction);
      expect(errors).toContain('Amount must be greater than 0');
    });
  });
});
