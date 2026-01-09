import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, finalize, Observable } from 'rxjs';
import {
  Product,
  PaginatedResponse,
  Category,
  CreateProductRequest,
  CreateCategoryRequest,
} from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;
  private catUrl = `${environment.apiUrl}/categories`; // Assuming you created this endpoint

  // Existing State
  products = signal<Product[]>([]);
  totalItems = signal(0);
  totalPages = signal(0); // New signal
  currentPage = signal(1); // New signal
  itemsPerPage = signal(10); // New signal
  isLoading = signal(false);

  // New Signal for Categories (for the dropdown)
  categories = signal<Category[]>([]);

  loadProducts(page = 1, limit = 10, search = '', categoryId?: string) {
    this.isLoading.set(true);
    let url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }

    return this.http.get<PaginatedResponse<Product>>(url).pipe(
      tap((res) => {
        this.products.set(res.data);
        this.totalItems.set(res.pagination.totalItems);
        this.totalPages.set(res.pagination.totalPages);
        this.currentPage.set(res.pagination.currentPage);
        this.itemsPerPage.set(res.pagination.itemsPerPage);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  // --- NEW METHODS ---

  fetchCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.catUrl).pipe(tap((cats) => this.categories.set(cats)));
  }

  createCategory(data: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.catUrl, data).pipe(
      tap((newCat) => {
        this.categories.update((cats) => [...cats, newCat]);
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(data: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data).pipe(
      tap(() => {
        // Reload products or update local state
        this.loadProducts(this.currentPage(), this.itemsPerPage()).subscribe();
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.products.update((prev) => prev.filter((p) => p.id !== id));
        this.totalItems.update((total) => total - 1);
      })
    );
  }
}
