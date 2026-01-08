import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, finalize, Observable } from 'rxjs';
import { Product, PaginatedResponse } from '../../models/api.models';

import { Category } from '../../models/api.models';

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

  // Updated to include categoryId
  loadProducts(page = 1, limit = 10, search = '', categoryId?: string) {
    this.isLoading.set(true);
    let url = `${this.apiUrl}?page=${page}&limit=${limit}&search=${search}`;
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

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
