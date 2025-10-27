/**
 * NutrientsPage - CRUD interface for managing nutrients
 */

import { useState } from 'react';
import { useNutrients, useNutrientMutations } from '../../hooks/useCRUD';
import { useNutrientStore } from '../../stores/crudStore';
import { Nutrient, NutrientCreateInput, NutrientUpdateInput } from '../../types/crud.types';
import {
  DataTable,
  SearchFilter,
  Pagination,
  DeleteConfirmation,
  FormModal,
} from '../../components/crud';

export function NutrientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const { selectedNutrient, setSelectedNutrient, clearSelectedNutrient } = useNutrientStore();
  const { data, loading, error, total, refresh, setSearch, setPage, setLimit, currentPage, limit } = useNutrients();
  const { create, update, remove, loading: mutationLoading } = useNutrientMutations();

  const handleCreate = () => {
    clearSelectedNutrient();
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (nutrient: Nutrient) => {
    setSelectedNutrient(nutrient);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (nutrient: Nutrient) => {
    setSelectedNutrient(nutrient);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    let success = false;
    
    if (modalMode === 'create') {
      success = await create(formData as NutrientCreateInput);
    } else if (selectedNutrient) {
      success = await update(selectedNutrient.id, formData as NutrientUpdateInput);
    }

    if (success) {
      setIsModalOpen(false);
      clearSelectedNutrient();
      refresh();
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedNutrient) {
      const success = await remove(selectedNutrient.id);
      if (success) {
        setIsDeleteOpen(false);
        clearSelectedNutrient();
        refresh();
      }
    }
  };

  const formFields = [
    { name: 'name', label: 'Name', type: 'text' as const, required: true, placeholder: 'Vitamine C' },
  ];

  const columns = [
    { key: 'name', header: 'Name', width: '100%' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Nutrients Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage vitamins, minerals, and other essential nutrients
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
            placeholder="Search nutrients by name..."
          />
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Nutrient</span>
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyExtractor={(nutrient) => nutrient.id}
        emptyMessage="No nutrients found. Create your first nutrient!"
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
        title={modalMode === 'create' ? 'Create Nutrient' : 'Edit Nutrient'}
        fields={formFields}
        initialData={selectedNutrient || {}}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          clearSelectedNutrient();
        }}
        loading={mutationLoading}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        itemName={selectedNutrient?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          clearSelectedNutrient();
        }}
        loading={mutationLoading}
      />
    </div>
  );
}
