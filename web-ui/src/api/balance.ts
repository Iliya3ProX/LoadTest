import axios from 'axios';
import type { Balance, BalanceList, CreateBalanceRequest, DepositRequest, ExpenseRequest } from '@/types/api';

const api = axios.create({
  baseURL: '/api/balances',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const balanceApi = {
  async getAll(): Promise<BalanceList[]> {
    const response = await api.get<BalanceList[]>('/');
    return response.data;
  },

  async getById(id: string): Promise<Balance> {
    const response = await api.get<Balance>(`/${id}`);
    return response.data;
  },

  async create(request: CreateBalanceRequest): Promise<string> {
    const response = await api.post<string>('/', request);
    return response.data;
  },

  async deposit(id: string, request: DepositRequest): Promise<string> {
    const response = await api.post<string>(`/${id}/deposit`, request);
    return response.data;
  },

  async expense(id: string, request: ExpenseRequest): Promise<string> {
    const response = await api.post<string>(`/${id}/expense`, request);
    return response.data;
  },

  async trim(id: string): Promise<string> {
    const response = await api.post<string>(`/${id}/trim`);
    return response.data;
  }
};
