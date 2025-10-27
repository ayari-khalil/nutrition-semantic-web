/**
 * CRUD API Service
 * Handles all HTTP requests to the Backend CRUD endpoints
 */

import axios, { AxiosInstance } from 'axios';
import {
  User, UserCreateInput, UserUpdateInput,
  Diet, DietCreateInput, DietUpdateInput,
  Nutrient, NutrientCreateInput, NutrientUpdateInput,
  Food, FoodCreateInput, FoodUpdateInput,
  ApiResponse, PaginatedResponse, StatsResponse
} from '../types/crud.types';

// Base API configuration
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE_URL = BASE_URL.endsWith('/') ? `${BASE_URL}api` : `${BASE_URL}/api`;

class CRUDService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // ============= User Operations =============
  async createUser(data: UserCreateInput): Promise<ApiResponse<User>> {
    const response = await this.api.post<ApiResponse<User>>('/users', data);
    return response.data;
  }

  async getUsers(limit = 10, offset = 0, search?: string): Promise<PaginatedResponse<User>> {
    const params = { limit, offset, ...(search && { search }) };
    const response = await this.api.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await this.api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, data: UserUpdateInput): Promise<ApiResponse<User>> {
    const response = await this.api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.api.delete<ApiResponse<{ message: string }>>(`/users/${id}`);
    return response.data;
  }

  async countUsers(): Promise<ApiResponse<{ count: number }>> {
    const response = await this.api.get<ApiResponse<{ count: number }>>('/users/count');
    return response.data;
  }

  // ============= Diet Operations =============
  async createDiet(data: DietCreateInput): Promise<ApiResponse<Diet>> {
    const response = await this.api.post<ApiResponse<Diet>>('/diets', data);
    return response.data;
  }

  async getDiets(limit = 10, offset = 0, search?: string): Promise<PaginatedResponse<Diet>> {
    const params = { limit, offset, ...(search && { search }) };
    const response = await this.api.get<PaginatedResponse<Diet>>('/diets', { params });
    return response.data;
  }

  async getDietById(id: string): Promise<ApiResponse<Diet>> {
    const response = await this.api.get<ApiResponse<Diet>>(`/diets/${id}`);
    return response.data;
  }

  async updateDiet(id: string, data: DietUpdateInput): Promise<ApiResponse<Diet>> {
    const response = await this.api.put<ApiResponse<Diet>>(`/diets/${id}`, data);
    return response.data;
  }

  async deleteDiet(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.api.delete<ApiResponse<{ message: string }>>(`/diets/${id}`);
    return response.data;
  }

  async countDiets(): Promise<ApiResponse<{ count: number }>> {
    const response = await this.api.get<ApiResponse<{ count: number }>>('/diets/count');
    return response.data;
  }

  // ============= Nutrient Operations =============
  async createNutrient(data: NutrientCreateInput): Promise<ApiResponse<Nutrient>> {
    const response = await this.api.post<ApiResponse<Nutrient>>('/nutrients', data);
    return response.data;
  }

  async getNutrients(limit = 10, offset = 0, search?: string): Promise<PaginatedResponse<Nutrient>> {
    const params = { limit, offset, ...(search && { search }) };
    const response = await this.api.get<PaginatedResponse<Nutrient>>('/nutrients', { params });
    return response.data;
  }

  async getNutrientById(id: string): Promise<ApiResponse<Nutrient>> {
    const response = await this.api.get<ApiResponse<Nutrient>>(`/nutrients/${id}`);
    return response.data;
  }

  async updateNutrient(id: string, data: NutrientUpdateInput): Promise<ApiResponse<Nutrient>> {
    const response = await this.api.put<ApiResponse<Nutrient>>(`/nutrients/${id}`, data);
    return response.data;
  }

  async deleteNutrient(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.api.delete<ApiResponse<{ message: string }>>(`/nutrients/${id}`);
    return response.data;
  }

  async countNutrients(): Promise<ApiResponse<{ count: number }>> {
    const response = await this.api.get<ApiResponse<{ count: number }>>('/nutrients/count');
    return response.data;
  }

  // ============= Food Operations =============
  async createFood(data: FoodCreateInput): Promise<ApiResponse<Food>> {
    const response = await this.api.post<ApiResponse<Food>>('/foods', data);
    return response.data;
  }

  async getFoods(limit = 10, offset = 0, search?: string): Promise<PaginatedResponse<Food>> {
    const params = { limit, offset, ...(search && { search }) };
    const response = await this.api.get<PaginatedResponse<Food>>('/foods', { params });
    return response.data;
  }

  async getFoodById(id: string): Promise<ApiResponse<Food>> {
    const response = await this.api.get<ApiResponse<Food>>(`/foods/${id}`);
    return response.data;
  }

  async updateFood(id: string, data: FoodUpdateInput): Promise<ApiResponse<Food>> {
    const response = await this.api.put<ApiResponse<Food>>(`/foods/${id}`, data);
    return response.data;
  }

  async deleteFood(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.api.delete<ApiResponse<{ message: string }>>(`/foods/${id}`);
    return response.data;
  }

  async countFoods(): Promise<ApiResponse<{ count: number }>> {
    const response = await this.api.get<ApiResponse<{ count: number }>>('/foods/count');
    return response.data;
  }

  // ============= Statistics =============
  async getStats(): Promise<StatsResponse> {
    const response = await this.api.get<StatsResponse>('/stats');
    return response.data;
  }
}

// Export singleton instance
export const crudService = new CRUDService();
export default crudService;
