import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, Observable } from 'rxjs';
import { Category, CreateCategoryRequest } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categories`;

  categories = signal<Category[]>([]);
  isLoading = signal(false);

  getAllCategories(): Observable<Category[]> {
    this.isLoading.set(true);
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap((cats) => {
        this.categories.set(cats);
        this.isLoading.set(false);
      })
    );
  }

  createCategory(data: CreateCategoryRequest): Observable<Category> {
    this.isLoading.set(true);
    return this.http.post<Category>(this.apiUrl, data).pipe(
      tap((newCat) => {
        this.categories.update((cats) => [...cats, newCat]);
        this.isLoading.set(false);
      })
    );
  }
}
