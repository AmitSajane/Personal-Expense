import axios from 'axios';
import { Transaction, ApiResponse, PaginatedResponse } from '../types';
import { storageService } from './storageService';

const API_BASE_URL = 'https://api.personalfinance.app'; // Mock API URL

class TransactionService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await axios({
        url: `${API_BASE_URL}${endpoint}`,
        method: options.method || 'GET',
        data: options.body ? JSON.parse(options.body as string) : undefined,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        timeout: 10000,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      // Fallback to local storage in case of network error
      console.warn('API request failed, falling back to local storage:', error.message);
      throw error;
    }
  }

  async getTransactions(params: { page?: number; limit?: number } = {}): Promise<ApiResponse<Transaction[]>> {
    try {
      return await this.makeRequest<Transaction[]>(`/transactions?page=${params.page || 1}&limit=${params.limit || 50}`);
    } catch (error) {
      // Fallback to local storage
      const transactions = await storageService.getTransactions();
      return {
        success: true,
        data: transactions,
      };
    }
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Transaction>> {
    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const response = await this.makeRequest<Transaction>('/transactions', {
        method: 'POST',
        body: JSON.stringify(newTransaction),
      });
      
      // Also save to local storage
      await storageService.saveTransaction(response.data);
      return response;
    } catch (error) {
      // Fallback to local storage only
      await storageService.saveTransaction(newTransaction);
      return {
        success: true,
        data: newTransaction,
      };
    }
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
    const updatedTransaction = {
      ...updates,
      id,
      updatedAt: new Date(),
    } as Transaction;

    try {
      const response = await this.makeRequest<Transaction>(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTransaction),
      });
      
      await storageService.updateTransaction(id, updatedTransaction);
      return response;
    } catch (error) {
      await storageService.updateTransaction(id, updatedTransaction);
      return {
        success: true,
        data: updatedTransaction,
      };
    }
  }

  async deleteTransaction(id: string): Promise<ApiResponse<void>> {
    try {
      await this.makeRequest<void>(`/transactions/${id}`, {
        method: 'DELETE',
      });
      
      await storageService.deleteTransaction(id);
      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      await storageService.deleteTransaction(id);
      return {
        success: true,
        data: undefined,
      };
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const transactionService = new TransactionService();
