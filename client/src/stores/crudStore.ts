/**
 * Zustand stores for CRUD state management
 * Simple global state for managing selected items and UI state
 */

import { create } from 'zustand';
import { User, Diet, Nutrient, Food } from '../types/crud.types';

// ============= UI State Store =============
interface UIState {
  // Modal states
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | null;
  modalEntity: 'users' | 'diets' | 'nutrients' | 'foods' | null;
  
  // Delete confirmation
  isDeleteDialogOpen: boolean;
  itemToDelete: { id: string; name: string; entity: string } | null;
  
  // Actions
  openModal: (entity: 'users' | 'diets' | 'nutrients' | 'foods', mode: 'create' | 'edit') => void;
  closeModal: () => void;
  openDeleteDialog: (id: string, name: string, entity: string) => void;
  closeDeleteDialog: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  modalMode: null,
  modalEntity: null,
  isDeleteDialogOpen: false,
  itemToDelete: null,
  
  openModal: (entity, mode) => set({ 
    isModalOpen: true, 
    modalEntity: entity, 
    modalMode: mode 
  }),
  
  closeModal: () => set({ 
    isModalOpen: false, 
    modalMode: null, 
    modalEntity: null 
  }),
  
  openDeleteDialog: (id, name, entity) => set({ 
    isDeleteDialogOpen: true, 
    itemToDelete: { id, name, entity } 
  }),
  
  closeDeleteDialog: () => set({ 
    isDeleteDialogOpen: false, 
    itemToDelete: null 
  }),
}));

// ============= User Store =============
interface UserState {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  clearSelectedUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  clearSelectedUser: () => set({ selectedUser: null }),
}));

// ============= Diet Store =============
interface DietState {
  selectedDiet: Diet | null;
  setSelectedDiet: (diet: Diet | null) => void;
  clearSelectedDiet: () => void;
}

export const useDietStore = create<DietState>((set) => ({
  selectedDiet: null,
  setSelectedDiet: (diet) => set({ selectedDiet: diet }),
  clearSelectedDiet: () => set({ selectedDiet: null }),
}));

// ============= Nutrient Store =============
interface NutrientState {
  selectedNutrient: Nutrient | null;
  setSelectedNutrient: (nutrient: Nutrient | null) => void;
  clearSelectedNutrient: () => void;
}

export const useNutrientStore = create<NutrientState>((set) => ({
  selectedNutrient: null,
  setSelectedNutrient: (nutrient) => set({ selectedNutrient: nutrient }),
  clearSelectedNutrient: () => set({ selectedNutrient: null }),
}));

// ============= Food Store =============
interface FoodState {
  selectedFood: Food | null;
  setSelectedFood: (food: Food | null) => void;
  clearSelectedFood: () => void;
}

export const useFoodStore = create<FoodState>((set) => ({
  selectedFood: null,
  setSelectedFood: (food) => set({ selectedFood: food }),
  clearSelectedFood: () => set({ selectedFood: null }),
}));
