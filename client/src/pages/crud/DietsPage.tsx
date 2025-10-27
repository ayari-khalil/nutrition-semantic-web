/**
 * DietsPage - CRUD interface for managing diets
 */

import { useState } from 'react';
import { useDiets, useDietMutations } from '../../hooks/useCRUD';
import { useDietStore } from '../../stores/crudStore';
import { Diet, DietCreateInput, DietUpdateInput } from '../../types/crud.types';
import {
  DataTable,
  SearchFilter,
  Pagination,
  DeleteConfirmation,
  FormModal,
} from '../../components/crud';

export function DietsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const { selectedDiet, setSelectedDiet, clearSelectedDiet } = useDietStore();
  const { data, loading, error, total, refresh, setSearch, setPage, setLimit, currentPage, limit } = useDiets();
  const { create, update, remove, loading: mutationLoading } = useDietMutations();

  const handleCreate = () => {
    clearSelectedDiet();
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (diet: Diet) => {
    setSelectedDiet(diet);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (diet: Diet) => {
    setSelectedDiet(diet);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    let success = false;
    
    if (modalMode === 'create') {
      success = await create(formData as DietCreateInput);
    } else if (selectedDiet) {
      success = await update(selectedDiet.id, formData as DietUpdateInput);
    }

    if (success) {
      setIsModalOpen(false);
      clearSelectedDiet();
      refresh();
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedDiet) {
      const success = await remove(selectedDiet.id);
      if (success) {
        setIsDeleteOpen(false);
        clearSelectedDiet();
        refresh();
      }
    }
  };

  const formFields = [
    { name: 'name', label: 'Name', type: 'text' as const, placeholder: 'Mon petit déjeuner' },
    { 
      name: 'type', 
      label: 'Meal Type', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'PetitDéjeuner', label: 'Petit-Déjeuner' },
        { value: 'Déjeuner', label: 'Déjeuner' },
        { value: 'Dîner', label: 'Dîner' },
        { value: 'Collation', label: 'Collation' },
      ],
    },
    { name: 'date', label: 'Date (ISO format)', type: 'text' as const, required: true, placeholder: '2025-10-26T08:00:00' },
    { name: 'foods', label: 'Foods (IDs)', type: 'array' as const, placeholder: 'Pomme, Quinoa' },
  ];

  const columns = [
    { key: 'name', header: 'Name', width: '25%' },
    { key: 'type', header: 'Type', width: '20%' },
    { 
      key: 'date', 
      header: 'Date', 
      width: '25%',
      render: (diet: Diet) => diet.date ? new Date(diet.date).toLocaleString() : '-',
    },
    {
      key: 'foods',
      header: 'Foods',
      width: '30%',
      render: (diet: Diet) => diet.foods?.join(', ') || '-',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Diets Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage dietary regimens and eating plans
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
            placeholder="Search diets by name..."
          />
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Diet</span>
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyExtractor={(diet) => diet.id}
        emptyMessage="No diets found. Create your first diet!"
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
        title={modalMode === 'create' ? 'Create Diet' : 'Edit Diet'}
        fields={formFields}
        initialData={selectedDiet || {}}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          clearSelectedDiet();
        }}
        loading={mutationLoading}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        itemName={selectedDiet?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          clearSelectedDiet();
        }}
        loading={mutationLoading}
      />
    </div>
  );
}
