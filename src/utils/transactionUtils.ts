import { Transaction, CategorySummary } from '../types';

/**
 * Groups transactions by category and calculates total spending per category
 * Part 3 - Data Structures & Algorithms requirement
 */
export function groupTransactionsByCategory(transactions: Transaction[]): CategorySummary {
  const summary: CategorySummary = {};
  
  transactions.forEach((transaction) => {
    if (transaction.type === 'expense') {
      summary[transaction.category] = (summary[transaction.category] || 0) + transaction.amount;
    }
  });
  
  return summary;
}

/**
 * Sorts transactions by date in descending order
 * Part 3 - Data Structures & Algorithms requirement
 */
export function sortTransactionsByDate(transactions: Transaction[], order: 'asc' | 'desc' = 'desc'): Transaction[] {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

/**
 * Calculates compound interest over n periods
 * Part 3 - Data Structures & Algorithms requirement
 */
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  periods: number,
  currentPeriod: number = 0
): number {
  // Base case: if we've reached the target number of periods
  if (currentPeriod >= periods) {
    return principal;
  }
  
  // Calculate interest for current period
  const interest = principal * rate;
  const newPrincipal = principal + interest;
  
  // Recursive call for next period
  return calculateCompoundInterest(newPrincipal, rate, periods, currentPeriod + 1);
}

/**
 * Calculates total income from transactions
 */
export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculates total expenses from transactions
 */
export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculates net worth (income - expenses)
 */
export function calculateNetWorth(transactions: Transaction[]): number {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
}

/**
 * Gets transactions for a specific date range
 */
export function getTransactionsInRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
}

/**
 * Gets transactions for current month
 */
export function getCurrentMonthTransactions(transactions: Transaction[]): Transaction[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return getTransactionsInRange(transactions, startOfMonth, endOfMonth);
}

/**
 * Formats currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Formats date for display
 */
export function formatDate(date: Date | string): string {
  try {
    // Convert to Date object if it's a string
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Validates transaction data
 */
export function validateTransaction(transaction: Partial<Transaction>): string[] {
  const errors: string[] = [];
  
  if (!transaction.amount || transaction.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!transaction.category || transaction.category.trim() === '') {
    errors.push('Category is required');
  }
  
  if (!transaction.description || transaction.description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
    errors.push('Type must be either income or expense');
  }
  
  if (!transaction.date) {
    errors.push('Date is required');
  }
  
  return errors;
}
