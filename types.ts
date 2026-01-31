
// Enum for User Roles
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin'
}

// User Model (Matches DB: users table)
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Product Model (Matches DB: products table)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
}

// Cart Item (Matches Logic: order_items table mostly)
export interface CartItem extends Product {
  quantity: number;
}

// Order Status Enum
export enum OrderStatus {
  PENDING = 'Chờ xử lý',
  SHIPPING = 'Đang giao',
  COMPLETED = 'Hoàn thành',
  CANCELLED = 'Đã hủy'
}

// Order Model (Matches DB: orders table)
export interface Order {
  id: string;
  userId: number;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  date: string;
  items: number; // Count of items
}

// Toast Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}
