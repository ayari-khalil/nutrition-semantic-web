/**
 * TypeScript type definitions for CRUD entities
 */

// ============= Base Types =============
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// ============= User Entity =============
export interface User extends BaseEntity {
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  allergies?: string[];
  preferences?: string[];
  diet_type?: 'Vegetarian' | 'Vegan' | 'Keto' | 'Paleo' | 'Mediterranean' | 'Low-Carb' | 'Gluten-Free' | 'Omnivore';
}

export interface UserCreateInput {
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  allergies?: string[];
  preferences?: string[];
  diet_type?: string;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  allergies?: string[];
  preferences?: string[];
  diet_type?: string;
}

// ============= Diet Entity =============
export interface Diet extends BaseEntity {
  name?: string;
  type: string; // typeRepas: PetitDéjeuner, Déjeuner, Dîner, Collation
  date: string; // aDate
  foods?: string[]; // contient relationship
}

export interface DietCreateInput {
  name?: string;
  type: string;
  date: string;
  foods?: string[];
}

export interface DietUpdateInput {
  name?: string;
  type?: string;
  date?: string;
  foods?: string[];
}

// ============= Nutrient Entity =============
export interface Nutrient extends BaseEntity {
  name: string; // nomNutriment
}

export interface NutrientCreateInput {
  name: string;
}

export interface NutrientUpdateInput {
  name?: string;
}

// ============= Food Entity =============
export interface Food extends BaseEntity {
  name: string;
  category: 'Fruit' | 'Vegetable' | 'Grain' | 'Protein' | 'Dairy' | 'Nut' | 'Legume' | 'Meat' | 'Seafood' | 'Other';
  calories?: number;
  proteins?: number;
  carbohydrates?: number;
  fats?: number;
  fiber?: number;
  description?: string;
  nutrients?: string[];
}

export interface FoodCreateInput {
  name: string;
  category: 'Fruit' | 'Vegetable' | 'Grain' | 'Protein' | 'Dairy' | 'Nut' | 'Legume' | 'Meat' | 'Seafood' | 'Other';
  calories?: number;
  proteins?: number;
  carbohydrates?: number;
  fats?: number;
  fiber?: number;
  description?: string;
  nutrients?: string[];
}

export interface FoodUpdateInput {
  name?: string;
  category?: 'Fruit' | 'Vegetable' | 'Grain' | 'Protein' | 'Dairy' | 'Nut' | 'Legume' | 'Meat' | 'Seafood' | 'Other';
  calories?: number;
  proteins?: number;
  carbohydrates?: number;
  fats?: number;
  fiber?: number;
  description?: string;
  nutrients?: string[];
}

// ============= API Response Types =============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface StatsResponse {
  success: boolean;
  data: {
    users: number;
    diets: number;
    nutrients: number;
    foods: number;
  };
}

// ============= UI Types =============
export type EntityType = 'users' | 'diets' | 'nutrients' | 'foods';

export interface PaginationState {
  limit: number;
  offset: number;
  total: number;
}

export interface FilterState {
  search: string;
}

export interface FormMode {
  type: 'create' | 'edit';
  data?: any;
}
