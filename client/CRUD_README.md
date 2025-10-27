# Frontend CRUD System Documentation

## 🎯 Overview

Complete CRUD (Create, Read, Update, Delete) interface for managing the nutrition semantic web database. Built with React 19, TypeScript, and Tailwind CSS.

## 📁 Project Structure

```
client/src/
├── types/
│   └── crud.types.ts           # TypeScript interfaces for all entities
├── services/
│   └── crudService.ts          # API service for Backend communication
├── hooks/
│   └── useCRUD.ts              # Custom React hooks for data fetching
├── stores/
│   └── crudStore.ts            # Zustand stores for state management
├── components/crud/
│   ├── DataTable.tsx           # Reusable table component
│   ├── SearchFilter.tsx        # Search input with debouncing
│   ├── Pagination.tsx          # Pagination controls
│   ├── DeleteConfirmation.tsx  # Delete confirmation modal
│   ├── FormModal.tsx           # Generic form modal
│   └── index.ts                # Component exports
├── pages/
│   ├── HomePage.tsx            # Main AI query interface
│   └── crud/
│       ├── UsersPage.tsx       # User management
│       ├── DietsPage.tsx       # Diet management
│       ├── NutrientsPage.tsx   # Nutrient management
│       ├── FoodsPage.tsx       # Food management
│       └── index.ts            # Page exports
└── App.tsx                     # Main app with routing
```

## 🚀 Features

### Entity Management

- **Users**: Manage dietary preferences, allergies, and user profiles
- **Diets**: Manage dietary regimens (Keto, Mediterranean, etc.)
- **Nutrients**: Manage vitamins, minerals, and nutritional information
- **Foods**: Manage food items with complete nutritional data

### CRUD Operations

- ✅ Create new entities with validation
- ✅ Read/List entities with pagination
- ✅ Update existing entities
- ✅ Delete entities with confirmation
- ✅ Search entities by name
- ✅ View statistics

### UI Features

- 🎨 Dark mode support
- 📱 Responsive design
- 🔍 Real-time search with debouncing
- 📊 Pagination with customizable page size
- ⚡ Loading states and error handling
- ✨ Smooth animations and transitions

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd client
npm install
```

This will install:

- `react-router-dom@^6.28.0` - Routing
- All existing dependencies (React, TypeScript, Tailwind, Zustand, Axios)

### 2. Configure Environment

The `.env` file is already configured:

```properties
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm start
```

The app will be available at `http://localhost:3000`

## 📖 Usage Guide

### Navigation

The app includes a navigation bar with 5 sections:

- 🏠 **Home** - AI query interface
- 👤 **Users** - User management
- 🥗 **Diets** - Diet management
- 💊 **Nutrients** - Nutrient management
- 🍎 **Foods** - Food management

### Creating an Entity

1. Click the "Add [Entity]" button
2. Fill in the required fields (marked with \*)
3. Optional fields can be left empty
4. Array fields accept comma-separated values
5. Click "Create" to save

### Editing an Entity

1. Click "Edit" button in the table row
2. Modify the fields
3. Click "Update" to save changes

### Deleting an Entity

1. Click "Delete" button in the table row
2. Confirm the deletion in the dialog
3. The entity will be permanently removed

### Searching

- Type in the search box at the top
- Results filter automatically after 300ms
- Clear search with the X button

### Pagination

- Change page using First/Previous/Next/Last buttons
- Jump to specific page by typing page number
- Adjust items per page (5, 10, 25, 50)

## 🔧 API Integration

### Service Layer

The `crudService` singleton handles all HTTP requests:

```typescript
import { crudService } from '@/services/crudService';

// Create user
const response = await crudService.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  gender: 'Male',
  allergies: ['peanuts'],
  diet_type: 'Vegetarian',
});

// Get users with pagination
const users = await crudService.getUsers(10, 0, 'John');

// Update user
await crudService.updateUser(id, { age: 31 });

// Delete user
await crudService.deleteUser(id);
```

### Custom Hooks

Hooks provide state management and loading/error handling:

```typescript
import { useUsers, useUserMutations } from '@/hooks/useCRUD';

function MyComponent() {
  // List hook with pagination
  const { data, loading, error, total, refresh, setSearch, setPage, setLimit } = useUsers();

  // Mutation hook
  const { create, update, remove, loading: mutationLoading } = useUserMutations();

  const handleCreate = async (formData) => {
    const success = await create(formData);
    if (success) {
      refresh(); // Reload list
    }
  };
}
```

## 🎨 Components

### DataTable

Generic table component for displaying entities:

```typescript
<DataTable
  data={users}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
  ]}
  loading={loading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  keyExtractor={(user) => user.id}
/>
```

### FormModal

Generic form modal for create/edit:

```typescript
<FormModal
  isOpen={isModalOpen}
  mode="create" // or "edit"
  title="Create User"
  fields={[
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'age', label: 'Age', type: 'number', min: 1, max: 150 },
    { name: 'allergies', label: 'Allergies', type: 'array' },
  ]}
  initialData={selectedUser || {}}
  onSubmit={handleSubmit}
  onCancel={() => setIsModalOpen(false)}
/>
```

### SearchFilter

Search input with debouncing:

```typescript
<SearchFilter
  onSearch={(query) => setSearch(query)}
  placeholder="Search users..."
  debounceMs={300}
/>
```

## 📝 TypeScript Types

All entities are fully typed:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  allergies?: string[];
  preferences?: string[];
  diet_type?: 'Vegetarian' | 'Vegan' | 'Keto' | ...;
  created_at?: string;
  updated_at?: string;
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create user with all fields
- [ ] Create user with only required fields
- [ ] Edit user and verify changes
- [ ] Delete user and confirm removal
- [ ] Search users by name
- [ ] Navigate pagination
- [ ] Change items per page
- [ ] Test dark mode
- [ ] Test responsive design
- [ ] Verify error handling (network errors)
- [ ] Verify validation (invalid email, age out of range)

Repeat for Diets, Nutrients, and Foods.

## 🐛 Troubleshooting

### API Connection Issues

If you see connection errors:

1. Ensure Backend is running: `cd Backend && python app.py`
2. Check Fuseki is running: `http://localhost:3030`
3. Verify `.env` has correct API URL
4. Check browser console for CORS errors

### Missing Data

If entities don't appear:

1. Check Backend has data in Fuseki
2. Verify SPARQL queries are working
3. Check browser Network tab for API responses
4. Check Backend console for errors

### Build Errors

If npm install fails:

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Ensure Node.js version is 14.x or higher

## 🎯 Next Steps

1. **Install Dependencies**: Run `npm install` in client folder
2. **Start Backend**: Ensure Flask server is running
3. **Start Frontend**: Run `npm start`
4. **Test CRUD**: Create, read, update, delete entities
5. **Verify Integration**: Check data persists in Fuseki

## 📚 Key Technologies

- **React 19.2.0** - UI library
- **TypeScript 4.9.5** - Type safety
- **React Router 6.28.0** - Routing
- **Zustand 5.0.8** - State management
- **Axios 1.12.2** - HTTP client
- **Tailwind CSS 3.4.1** - Styling
- **Framer Motion** - Animations

## 💡 Best Practices Implemented

✅ **Type Safety**: Full TypeScript coverage
✅ **Reusable Components**: Generic DataTable, FormModal
✅ **Custom Hooks**: Encapsulated data fetching logic
✅ **Error Handling**: Comprehensive error states
✅ **Loading States**: User feedback during operations
✅ **Responsive Design**: Mobile-first approach
✅ **Accessibility**: Semantic HTML and ARIA labels
✅ **Performance**: Debounced search, pagination
✅ **Code Organization**: Clear folder structure
✅ **Maintainability**: Simple, readable code

## 📄 License

Part of the Nutrition Semantic Web project.

---

**Created**: 2025
**Status**: ✅ Ready for testing
