// 1. User Model
export interface User {
  id: string;
  name: string;
  email: string;
}

// 2. Category Model (Matches your Prisma Category table)
export interface Category {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
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
