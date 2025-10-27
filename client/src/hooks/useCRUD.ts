/**
 * Custom React hooks for CRUD operations
 * Provides reusable hooks with loading states, error handling, and data fetching
 */

import { useState, useEffect, useCallback } from 'react';
import { crudService } from '../services/crudService';
import {
  User, UserCreateInput, UserUpdateInput,
  Diet, DietCreateInput, DietUpdateInput,
  Nutrient, NutrientCreateInput, NutrientUpdateInput,
  Food, FoodCreateInput, FoodUpdateInput,
  PaginatedResponse
} from '../types/crud.types';

// ============= Generic Hook Types =============
interface UseEntityListResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  total: number;
  refresh: () => Promise<void>;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  currentPage: number;
  limit: number;
}

interface UseEntityResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UseEntityMutationResult<TCreate, TUpdate> {
  create: (data: TCreate) => Promise<boolean>;
  update: (id: string, data: TUpdate) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

// ============= Generic List Hook =============
function useEntityList<T>(
  fetchFunction: (limit: number, offset: number, search?: string) => Promise<PaginatedResponse<T>>
): UseEntityListResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const offset = currentPage * limit;
      const response = await fetchFunction(limit, offset, search || undefined);
      setData(response.data);
      setTotal(response.pagination.total);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, search]); // Removed fetchFunction from dependencies

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetSearch = (newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(0); // Reset to first page on search
  };

  const handleSetPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetLimit = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(0); // Reset to first page on limit change
  };

  return {
    data,
    loading,
    error,
    total,
    refresh: fetchData,
    setSearch: handleSetSearch,
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    currentPage,
    limit,
  };
}

// ============= User Hooks =============
export function useUsers(): UseEntityListResult<User> {
  return useEntityList<User>(crudService.getUsers.bind(crudService));
}

export function useUser(id: string | null): UseEntityResult<User> {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await crudService.getUserById(id);
      setData(response.data || null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch user');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}

export function useUserMutations(): UseEntityMutationResult<UserCreateInput, UserUpdateInput> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: UserCreateInput): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await crudService.createUser(data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UserUpdateInput): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await crudService.updateUser(id, data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to update user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await crudService.deleteUser(id);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to delete user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, remove, loading, error };
}

// ============= Diet Hooks =============
export function useDiets(): UseEntityListResult<Diet> {
  return useEntityList<Diet>(crudService.getDiets.bind(crudService));
}

export function useDiet(id: string | null): UseEntityResult<Diet> {
  const [data, setData] = useState<Diet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await crudService.getDietById(id);
      setData(response.data || null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch diet');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}

export function useDietMutations(): UseEntityMutationResult<DietCreateInput, DietUpdateInput> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: DietCreateInput): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await crudService.createDiet(data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create diet');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: DietUpdateInput): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await crudService.updateDiet(id, data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to update diet');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await crudService.deleteDiet(id);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to delete diet');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, remove, loading, error };
}

// ============= Nutrient Hooks =============
export function useNutrients(): UseEntityListResult<Nutrient> {
  return useEntityList<Nutrient>(crudService.getNutrients.bind(crudService));
}

export function useNutrient(id: string | null): UseEntityResult<Nutrient> {
  const [data, setData] = useState<Nutrient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await crudService.getNutrientById(id);
      setData(response.data || null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch nutrient');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}

export function useNutrientMutations(): UseEntityMutationResult<NutrientCreateInput, NutrientUpdateInput> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: NutrientCreateInput): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await crudService.createNutrient(data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create nutrient');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: NutrientUpdateInput): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await crudService.updateNutrient(id, data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to update nutrient');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await crudService.deleteNutrient(id);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to delete nutrient');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, remove, loading, error };
}

// ============= Food Hooks =============
export function useFoods(): UseEntityListResult<Food> {
  return useEntityList<Food>(crudService.getFoods.bind(crudService));
}

export function useFood(id: string | null): UseEntityResult<Food> {
  const [data, setData] = useState<Food | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await crudService.getFoodById(id);
      setData(response.data || null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch food');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}

export function useFoodMutations(): UseEntityMutationResult<FoodCreateInput, FoodUpdateInput> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: FoodCreateInput): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await crudService.createFood(data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create food');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: FoodUpdateInput): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await crudService.updateFood(id, data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to update food');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await crudService.deleteFood(id);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to delete food');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, remove, loading, error };
}

// ============= Statistics Hook =============
export function useStats() {
  const [stats, setStats] = useState({ users: 0, diets: 0, nutrients: 0, foods: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await crudService.getStats();
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
}
