export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

// 1. User Model
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// 2. Category Model (Matches your Prisma Category table)
export interface Category {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

export interface CreateCategoryRequest {
  name: string;
}

// 3. Product Model (Matches your Prisma Product table)
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  categoryId: string;
  userId: string;
  category?: Category; // Nested relationship
  user?: User; // Nested relationship
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  categoryId: string;
}

// 4. Auth Request
export interface LoginRequest {
  email: string;
  password: string;
}

// 5. Auth Response (Matches your Prisma AuthResponse table)
export interface AuthResponse {
  user: User;
  token: string;
}

// 6. Paginated Response (Matches your Product Service query logic)
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;

  // Relations (Optional: only populated if you use 'include' in Prisma)
  user?: User;
  product?: Product;
}
