// API utility functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'An error occurred');
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Todo endpoints
  async getTodos() {
    return this.request('/api/todos');
  }

  async createTodo(todo: Partial<Todo>) {
    return this.request('/api/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
  }

  async updateTodo(id: string, todo: Partial<Todo>) {
    return this.request(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
    });
  }

  async deleteTodo(id: string) {
    return this.request(`/api/todos/${id}`, {
      method: 'DELETE',
    });
  }

  // Expense endpoints
  async getExpenses() {
    return this.request('/api/expenses');
  }

  async createExpense(expense: Partial<Expense>) {
    return this.request('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  async updateExpense(id: string, expense: Partial<Expense>) {
    return this.request(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  }

  async deleteExpense(id: string) {
    return this.request(`/api/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin endpoints
  async getUsers() {
    return this.request('/api/admin/users');
  }

  async createUser(user: Partial<User>) {
    return this.request('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: Partial<User>) {
    return this.request(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminStats() {
    return this.request('/api/admin/stats');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Import types
import { Todo, Expense, User } from '../types';