import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

// Layout & Guards
import AdminLayout from "./components/layout/AdminLayout";
import AuthGuard from "./components/layout/AuthGuard";
import PermissionGuard from "./components/layout/PermissionGuard";

// Auth Pages
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Feature Pages
import ProductList from "./components/products/ProductList";
import ProductForm from "./components/products/ProductForm";
import StockAdjust from "./components/inventory/StockAdjust";

import CategoryList from "./components/categories/CategoryList";
import CategoryForm from "./components/categories/CategoryForm";

import SizeList from "./components/sizes/SizeList";
import SizeForm from "./components/sizes/SizeForm";

import VendorList from "./components/vendors/VendorList";
import VendorForm from "./components/vendors/VendorForm";

import UserList from "./components/users/UserList";
import UserForm from "./components/users/UserForm";
import RoleList from "./components/roles/RoleList";
import RoleForm from "./components/roles/RoleForm";
import InventoryLogs from "./components/inventory/InventoryLogs";
import ProductDetail from "./components/products/ProductDetails";
import Dashboard from "./components/Dashboard/page";

// Permissions
import { PERMISSIONS } from "./constants/permissions";
import Profile from "./components/auth/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route element={<AuthGuard />}>
          <Route path="/" element={<AdminLayout />}>
            {/* Dashboard - Everyone can view */}
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />

            {/* Product Management */}
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.VIEW_PRODUCTS} />}>
              <Route path="products" element={<ProductList />} />
            </Route>
            
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.CREATE_PRODUCT} />}>
              <Route path="products/new" element={<ProductForm />} />
            </Route>
            
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.EDIT_PRODUCT} />}>
              <Route path="products/:id/edit" element={<ProductForm />} />
            </Route>

            {/* Inventory */}
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.VIEW_INVENTORY} />}>
              <Route path="inventory" element={<StockAdjust />} />
              <Route path="inventory-logs" element={<InventoryLogs />} />
            </Route>

            {/* Categories */}
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.VIEW_CATEGORIES} />}>
              <Route path="categories" element={<CategoryList />} />
            </Route>
            
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.CREATE_CATEGORY} />}>
              <Route path="categories/new" element={<CategoryForm />} />
              <Route path="categories/:id/edit" element={<CategoryForm />} />
            </Route>

            {/* Sizes */}
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.VIEW_SIZES} />}>
              <Route path="sizes" element={<SizeList />} />
            </Route>
            
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.CREATE_SIZE} />}>
              <Route path="sizes/new" element={<SizeForm />} />
              <Route path="sizes/:id/edit" element={<SizeForm />} />
            </Route>

            {/* Vendors */}
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.VIEW_VENDORS} />}>
              <Route path="vendors" element={<VendorList />} />
            </Route>
            
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.CREATE_VENDOR} />}>
              <Route path="vendors/new" element={<VendorForm />} />
              <Route path="vendors/:id/edit" element={<VendorForm />} />
            </Route>

            {/* User Management */}
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.VIEW_USERS} />}>
              <Route path="users" element={<UserList />} />
            </Route>
            
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.CREATE_USER} />}>
              <Route path="users/new" element={<UserForm />} />
              <Route path="users/:id" element={<UserForm />} />
              <Route path="users/:id/edit" element={<UserForm />} />
            </Route>

            {/* Access Control */}
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.VIEW_ROLES} />}>
              <Route path="roles" element={<RoleList />} />
            </Route>
            
            <Route element={<PermissionGuard requiredPermission={PERMISSIONS.CREATE_ROLE} />}>
              <Route path="roles/new" element={<RoleForm />} />
              <Route path="roles/:id/edit" element={<RoleForm />} />
            </Route>

            {/* Product Detail - Public within app */}
            <Route path="products/:id" element={<ProductDetail />} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;