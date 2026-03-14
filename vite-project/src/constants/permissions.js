export const PERMISSIONS = {
  // 📊 Dashboard
  VIEW_DASHBOARD: "view_dashboard",

  // 📦 Product Management
  VIEW_PRODUCTS: "view_products",
  CREATE_PRODUCT: "create_product",
  EDIT_PRODUCT: "edit_product",
  DELETE_PRODUCT: "delete_product",

  // 📉 Inventory/Stock Adjust
  VIEW_INVENTORY: "view_inventory",
  ADJUST_STOCK: "adjust_stock",

  // 🏷️ Category Management
  VIEW_CATEGORIES: "view_categories",
  CREATE_CATEGORY: "create_category",
  EDIT_CATEGORY: "edit_category",
  DELETE_CATEGORY: "delete_category",

  // 📏 Size Management
  VIEW_SIZES: "view_sizes",
  CREATE_SIZE: "create_size",
  EDIT_SIZE: "edit_size",
  DELETE_SIZE: "delete_size",

  // 🏪 Vendor Management
  VIEW_VENDORS: "view_vendors",
  CREATE_VENDOR: "create_vendor",
  EDIT_VENDOR: "edit_vendor",
  DELETE_VENDOR: "delete_vendor",

  // 👥 User/Staff Management
  VIEW_USERS: "view_users",
  CREATE_USER: "create_user",
  EDIT_USER: "edit_user",
  DELETE_USER: "delete_user",

  // 🔐 Access Control
  VIEW_ROLES: "view_roles",
  CREATE_ROLE: "create_role",
  EDIT_ROLE: "edit_role",
  DELETE_ROLE: "delete_role",
  MANAGE_ROLES: "manage_roles", // এটি যোগ করুন অথবা ম্যাট্রিক্সে VIEW_ROLES ব্যবহার করুন
};

export const PERMISSION_MATRIX = [
  {
    moduleName: "Inventory Operations",
    page: "Dashboard & Stock",
    features: [
      { label: "View Analytics Dashboard", value: PERMISSIONS.VIEW_DASHBOARD },
      { label: "View Real-time Inventory", value: PERMISSIONS.VIEW_INVENTORY },
      { label: "Authorize Stock Out", value: PERMISSIONS.ADJUST_STOCK },
    ],
  },
  {
    moduleName: "Product Management",
    page: "Central Catalog",
    features: [
      { label: "View Products", value: PERMISSIONS.VIEW_PRODUCTS },
      { label: "Add New Product", value: PERMISSIONS.CREATE_PRODUCT },
      { label: "Edit Product Details", value: PERMISSIONS.EDIT_PRODUCT },
      { label: "Remove Product", value: PERMISSIONS.DELETE_PRODUCT },
    ],
  },
  {
    moduleName: "Configurations",
    page: "Categories & Sizes",
    features: [
      { label: "View Categories", value: PERMISSIONS.VIEW_CATEGORIES },
      { label: "Manage Categories", value: PERMISSIONS.CREATE_CATEGORY },
      { label: "View Size Charts", value: PERMISSIONS.VIEW_SIZES },
      { label: "Manage Sizes", value: PERMISSIONS.CREATE_SIZE },
    ],
  },
  {
    moduleName: "Supply Chain",
    page: "Vendor Management",
    features: [
      { label: "View Vendor Directory", value: PERMISSIONS.VIEW_VENDORS },
      { label: "Add New Vendor", value: PERMISSIONS.CREATE_VENDOR },
      { label: "Update Vendor Info", value: PERMISSIONS.EDIT_VENDOR },
      { label: "Archive Vendor", value: PERMISSIONS.DELETE_VENDOR },
    ],
  },
  {
    moduleName: "System Administration",
    page: "Users & Security",
    features: [
      { label: "View Staff List", value: PERMISSIONS.VIEW_USERS },
      { label: "Register New User", value: PERMISSIONS.CREATE_USER },
      { label: "Edit User Access", value: PERMISSIONS.EDIT_USER },
      { label: "Revoke User", value: PERMISSIONS.DELETE_USER },
      { label: "Manage System Roles", value: PERMISSIONS.MANAGE_ROLES },
    ],
  },
];