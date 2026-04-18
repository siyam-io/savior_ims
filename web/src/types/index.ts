export interface Outlet {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
  subcategories: string[];
  sizes: string[];
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  categoryId: Category;
  subcategory: string;
  activatedSizes: string[];
  visuals: string[];
  stock: {
    size: string;
    quantity: number;
  }[];
}

export interface User {
  _id: string;
  email: string;
  name: string;
  profileImage: string;
  role: 'admin' | 'employee';
}

export interface OrderItem {
  productId: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  _id: string;
  employeeId: any;
  outletId: any;
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderNote?: string;
  riderNote?: string;
  discount: number;
  courierId?: any;
  verificationCall: boolean;
  deliveryStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
  deliveredAt?: string;
  createdBy: any;
  updatedBy?: any;
  createdAt: string;
}

export interface SalesAnalytics {
  employeeEmail: string;
  totalUnits: number;
  totalOrders: number;
}

export type CreateProductInput = {
  name: string;
  price: number;
  description: string;
  categoryId: string;
  subcategory: string;
  activatedSizes: string[];
  visuals: string[];
  stock: {
    size: string;
    quantity: number;
  }[];
};

export type UpdateProductInput = Partial<CreateProductInput> & { id: string };

export type PlaceOrderInput = {
  items: {
    productId: string;
    size: string;
    quantity: number;
    unitPrice: number;
  }[];
  outletId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderNote?: string;
  riderNote?: string;
  discount?: number;
  courierId?: string;
  verificationCall?: boolean;
};
