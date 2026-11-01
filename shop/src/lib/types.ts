/** Types describing the practice.amirm.me API payloads. */

export interface Category {
  id: number;
  slug: string;
  name: string;
}

export interface CategoryWithCount extends Category {
  productCount: number;
}

export interface CategoryList {
  data: CategoryWithCount[];
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  /** Price in Toman. */
  price: number;
  stock: number;
  inStock: boolean;
  /** Path on the API server, e.g. "/shop/images/volleyball.svg". */
  image: string;
  category: Category;
  created_at: string;
}

export type ProductSort = "newest" | "price" | "-price" | "name";

export interface ProductListQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export interface ProductList {
  data: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface LoginResult {
  token: string;
  expires_at: string;
  user: User;
}

export interface ApiCartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: ApiCartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  subtotal: number;
}

export type OrderStatus = "pending" | "paid" | "cancelled";

export interface Order {
  id: number;
  status: OrderStatus;
  fullName: string;
  phone: string;
  address: string;
  total: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderList {
  data: Order[];
  total: number;
}

export interface CheckoutInput {
  fullName: string;
  phone: string;
  address: string;
}

/**
 * Client-side cart line: a product snapshot plus quantity.
 * Used for both the guest cart (localStorage) and the logged-in cart
 * (mapped from the API cart) so the UI renders from one shape.
 */
export interface CartLine {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  inStock: boolean;
  quantity: number;
}
