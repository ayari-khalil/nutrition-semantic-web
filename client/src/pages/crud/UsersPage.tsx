/**
 * UsersPage - CRUD interface for managing users
 */

import { useState } from 'react';
import { useUsers, useUserMutations } from '../../hooks/useCRUD';
import { useUserStore } from '../../stores/crudStore';
import { User, UserCreateInput, UserUpdateInput } from '../../types/crud.types';
import {
  DataTable,
  SearchFilter,
  Pagination,
  DeleteConfirmation,
  FormModal,
} from '../../components/crud';

export function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const { selectedUser, setSelectedUser, clearSelectedUser } = useUserStore();
  const { data, loading, error, total, refresh, setSearch, setPage, setLimit, currentPage, limit } = useUsers();
  const { create, update, remove, loading: mutationLoading } = useUserMutations();

  const handleCreate = () => {
    clearSelectedUser();
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    let success = false;
    
    if (modalMode === 'create') {
      success = await create(formData as UserCreateInput);
    } else if (selectedUser) {
      success = await update(selectedUser.id, formData as UserUpdateInput);
    }

    if (success) {
      setIsModalOpen(false);
      clearSelectedUser();
      refresh();
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      const success = await remove(selectedUser.id);
      if (success) {
        setIsDeleteOpen(false);
        clearSelectedUser();
        refresh();
      }
    }
  };

  const formFields = [
    { name: 'name', label: 'Name', type: 'text' as const, required: true, placeholder: 'John Doe' },
    { name: 'email', label: 'Email', type: 'email' as const, required: true, placeholder: 'john@example.com' },
    { name: 'age', label: 'Age', type: 'number' as const, required: true, min: 1, max: 150 },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
      ],
    },
    {
      name: 'diet_type',
      label: 'Diet Type',
      type: 'select' as const,
      options: [
        { value: 'Végétarien', label: 'Végétarien' },
        { value: 'Végan', label: 'Végan' },
        { value: 'Carnivore', label: 'Carnivore' },
        { value: 'Pescatarien', label: 'Pescatarien' },
        { value: 'Méditerranéen', label: 'Méditerranéen' },
        { value: 'Keto', label: 'Keto' },
        { value: 'Paleo', label: 'Paleo' },
        { value: 'Autre', label: 'Autre' },
      ],
    },
    { name: 'allergies', label: 'Allergies', type: 'array' as const, placeholder: 'peanuts, shellfish, dairy' },
    { name: 'preferences', label: 'Preferences', type: 'array' as const, placeholder: 'organic, low-sodium, high-protein' },
  ];

  const columns = [
    { key: 'name', header: 'Name', width: '20%' },
    { key: 'email', header: 'Email', width: '25%' },
    { key: 'age', header: 'Age', width: '10%' },
    { key: 'gender', header: 'Gender', width: '10%' },
    {
      key: 'diet_type',
      header: 'Diet Type',
      width: '15%',
      render: (user: User) => user.diet_type || '-',
    },
    {
      key: 'allergies',
      header: 'Allergies',
      width: '20%',
      render: (user: User) => user.allergies?.join(', ') || '-',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Users Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage user profiles and dietary preferences
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
            placeholder="Search users by name..."
          />
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add User</span>
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyExtractor={(user) => user.id}
        emptyMessage="No users found. Create your first user!"
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
        title={modalMode === 'create' ? 'Create User' : 'Edit User'}
        fields={formFields}
        initialData={selectedUser || {}}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          clearSelectedUser();
        }}
        loading={mutationLoading}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        itemName={selectedUser?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          clearSelectedUser();
        }}
        loading={mutationLoading}
      />
    </div>
  );
}
