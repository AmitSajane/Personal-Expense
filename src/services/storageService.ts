import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';

const TRANSACTIONS_KEY = 'transactions';

class StorageService {
  async getTransactions(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      if (data) {
        const transactions = JSON.parse(data);
        // Convert date strings back to Date objects
        return transactions.map((t: any) => ({
          ...t,
          date: new Date(t.date),
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting transactions from storage:', error);
      return [];
    }
  }

  async saveTransaction(transaction: Transaction): Promise<void> {
    try {
      const existingTransactions = await this.getTransactions();
      const updatedTransactions = [...existingTransactions, transaction];
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error('Error saving transaction to storage:', error);
      throw error;
    }
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const index = transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updates };
        await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
      }
    } catch (error) {
      console.error('Error updating transaction in storage:', error);
      throw error;
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const filteredTransactions = transactions.filter(t => t.id !== id);
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filteredTransactions));
    } catch (error) {
      console.error('Error deleting transaction from storage:', error);
      throw error;
    }
  }

  async clearAllTransactions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TRANSACTIONS_KEY);
    } catch (error) {
      console.error('Error clearing transactions from storage:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
