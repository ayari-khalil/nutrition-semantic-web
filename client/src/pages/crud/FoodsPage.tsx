/**
 * FoodsPage - CRUD interface for managing foods
 */

import { useState } from 'react';
import { useFoods, useFoodMutations } from '../../hooks/useCRUD';
import { useFoodStore } from '../../stores/crudStore';
import { Food, FoodCreateInput, FoodUpdateInput } from '../../types/crud.types';
import {
  DataTable,
  SearchFilter,
  Pagination,
  DeleteConfirmation,
  FormModal,
} from '../../components/crud';

export function FoodsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const { selectedFood, setSelectedFood, clearSelectedFood } = useFoodStore();
  const { data, loading, error, total, refresh, setSearch, setPage, setLimit, currentPage, limit } = useFoods();
  const { create, update, remove, loading: mutationLoading } = useFoodMutations();

  const handleCreate = () => {
    clearSelectedFood();
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (food: Food) => {
    setSelectedFood(food);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (food: Food) => {
    setSelectedFood(food);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    let success = false;
    
    if (modalMode === 'create') {
      success = await create(formData as FoodCreateInput);
    } else if (selectedFood) {
      success = await update(selectedFood.id, formData as FoodUpdateInput);
    }

    if (success) {
      setIsModalOpen(false);
      clearSelectedFood();
      refresh();
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedFood) {
      const success = await remove(selectedFood.id);
      if (success) {
        setIsDeleteOpen(false);
        clearSelectedFood();
        refresh();
      }
    }
  };

  const formFields = [
    { name: 'name', label: 'Name', type: 'text' as const, required: true, placeholder: 'Banana' },
    {
      name: 'category',
      label: 'Category',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'Fruit', label: 'Fruit' },
        { value: 'Vegetable', label: 'Vegetable' },
        { value: 'Grain', label: 'Grain' },
        { value: 'Protein', label: 'Protein' },
        { value: 'Dairy', label: 'Dairy' },
        { value: 'Nut', label: 'Nut' },
        { value: 'Legume', label: 'Legume' },
        { value: 'Meat', label: 'Meat' },
        { value: 'Seafood', label: 'Seafood' },
        { value: 'Other', label: 'Other' },
      ],
    },
    { name: 'calories', label: 'Calories', type: 'number' as const, placeholder: '105', min: 0 },
    { name: 'proteins', label: 'Proteins (g)', type: 'number' as const, placeholder: '1.3', min: 0 },
    { name: 'carbohydrates', label: 'Carbohydrates (g)', type: 'number' as const, placeholder: '27', min: 0 },
    { name: 'fats', label: 'Fats (g)', type: 'number' as const, placeholder: '0.4', min: 0 },
    { name: 'fiber', label: 'Fiber (g)', type: 'number' as const, placeholder: '3.1', min: 0 },
    { name: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'A tropical fruit rich in potassium...' },
    { name: 'nutrients', label: 'Nutrients', type: 'array' as const, placeholder: 'potassium, vitamin B6, vitamin C' },
  ];

  const columns = [
    { key: 'name', header: 'Name', width: '15%' },
    { key: 'category', header: 'Category', width: '10%' },
    {
      key: 'calories',
      header: 'Calories',
      width: '10%',
      render: (food: Food) => food.calories || '-',
    },
    {
      key: 'macros',
      header: 'Macros (P/C/F)',
      width: '15%',
      render: (food: Food) => {
        const p = food.proteins ?? '-';
        const c = food.carbohydrates ?? '-';
        const f = food.fats ?? '-';
        return `${p}/${c}/${f}g`;
      },
    },
    {
      key: 'fiber',
      header: 'Fiber (g)',
      width: '10%',
      render: (food: Food) => food.fiber || '-',
    },
    {
      key: 'nutrients',
      header: 'Nutrients',
      width: '20%',
      render: (food: Food) => food.nutrients?.slice(0, 2).join(', ') || '-',
    },
    {
      key: 'description',
      header: 'Description',
      width: '20%',
      render: (food: Food) => {
        const desc = food.description || '-';
        return desc.length > 60 ? desc.substring(0, 60) + '...' : desc;
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Foods Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage food items and their nutritional information
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchFilter
            onSearch={setSearch}
            placeholder="Search foods by name..."
          />
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Food</span>
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyExtractor={(food) => food.id}
        emptyMessage="No foods found. Create your first food item!"
      />

      {!loading && total > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={setPage}
          onItemsPerPageChange={setLimit}
        />
      )}

      <FormModal
        isOpen={isModalOpen}
        mode={modalMode}
        title={modalMode === 'create' ? 'Create Food' : 'Edit Food'}
        fields={formFields}
        initialData={selectedFood || {}}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          clearSelectedFood();
        }}
        loading={mutationLoading}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        itemName={selectedFood?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          clearSelectedFood();
        }}
        loading={mutationLoading}
      />
    </div>
  );
}
