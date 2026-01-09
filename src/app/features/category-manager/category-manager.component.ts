import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-category-manager',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="category-manager" aria-labelledby="cat-title">
      <h2 id="cat-title">Manage Categories</h2>

      <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="category-form">
        <div class="form-field">
          <label for="categoryName">New Category Name</label>
          <input
            id="categoryName"
            type="text"
            formControlName="name"
            placeholder="Enter category name"
            [class.error]="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched"
          />
          @if (categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched) {
          <span class="error-msg">Category name is required</span>
          }
        </div>
        <button type="submit" [disabled]="categoryForm.invalid || categoryService.isLoading()">
          {{ categoryService.isLoading() ? 'Adding...' : 'Add Category' }}
        </button>
      </form>

      <div class="category-list">
        <h3>Existing Categories</h3>
        @if (categoryService.categories().length === 0) {
        <p>No categories found.</p>
        } @else {
        <ul>
          @for (cat of categoryService.categories(); track cat.id) {
          <li>
            <span>{{ cat.name }}</span>
            <span class="count">({{ cat._count?.products || 0 }} products)</span>
          </li>
          }
        </ul>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .category-manager {
        padding: 1.5rem;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      h2 {
        margin-bottom: 1rem;
        color: #333;
      }

      .category-form {
        display: flex;
        gap: 1rem;
        align-items: flex-end;
        margin-bottom: 2rem;
        flex-wrap: wrap;

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          min-width: 200px;

          label {
            font-weight: 500;
            font-size: 0.9rem;
          }

          input {
            padding: 0.6rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            &.error {
              border-color: #dc3545;
            }
          }

          .error-msg {
            color: #dc3545;
            font-size: 0.8rem;
          }
        }

        button {
          padding: 0.6rem 1.2rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          height: 40px;

          &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
          &:hover:not(:disabled) {
            background-color: #0056b3;
          }
        }
      }

      .category-list {
        h3 {
          font-size: 1.1rem;
          margin-bottom: 0.8rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f9f9f9;
          display: flex;
          justify-content: space-between;
          .count {
            color: #666;
            font-size: 0.9rem;
          }
        }
      }
    `,
  ],
})
export class CategoryManagerComponent implements OnInit {
  categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe();
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.categoryService.createCategory(this.categoryForm.getRawValue()).subscribe(() => {
        this.categoryForm.reset();
      });
    }
  }
}
