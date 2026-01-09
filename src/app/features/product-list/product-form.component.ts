import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="product-form-container" aria-labelledby="form-title">
      <h2 id="form-title">Create New Product</h2>

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
        <div class="form-grid">
          <div class="form-field">
            <label for="name">Product Name</label>
            <input id="name" type="text" formControlName="name" placeholder="Name" />
          </div>

          <div class="form-field">
            <label for="price">Price</label>
            <input id="price" type="number" formControlName="price" placeholder="0.00" />
          </div>

          <div class="form-field">
            <label for="categoryId">Category</label>
            <select id="categoryId" formControlName="categoryId">
              <option value="">Select Category</option>
              @for (cat of productService.categories(); track cat.id) {
              <option [value]="cat.id">{{ cat.name }}</option>
              }
            </select>
          </div>

          <div class="form-field">
            <label for="imageUrl">Image URL</label>
            <input id="imageUrl" type="text" formControlName="imageUrl" placeholder="https://..." />
          </div>

          <div class="form-field full-width">
            <label for="description">Description</label>
            <textarea id="description" formControlName="description" rows="3"></textarea>
          </div>
        </div>

        <button type="submit" [disabled]="productForm.invalid || productService.isLoading()">
          {{ productService.isLoading() ? 'Creating...' : 'Create Product' }}
        </button>
      </form>
    </section>
  `,
  styles: [
    `
      .product-form-container {
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 8px;
        margin-bottom: 2rem;
        border: 1px solid #dee2e6;
      }

      h2 {
        margin-bottom: 1.5rem;
        font-size: 1.25rem;
      }

      .product-form {
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;

          .full-width {
            grid-column: 1 / -1;
          }
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;

          label {
            font-size: 0.9rem;
            font-weight: 500;
            color: #495057;
          }

          input,
          select,
          textarea {
            padding: 0.6rem;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-family: inherit;

            &:focus {
              outline: none;
              border-color: #80bdff;
              box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            }
          }
        }

        button {
          padding: 0.75rem 1.5rem;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s;

          &:hover:not(:disabled) {
            background-color: #218838;
          }
          &:disabled {
            background-color: #6c757d;
            cursor: not-allowed;
          }
        }
      }
    `,
  ],
})
export class ProductFormComponent {
  productService = inject(ProductService);
  private fb = inject(FormBuilder);

  productForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    description: [''],
    imageUrl: [''],
    categoryId: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.productForm.valid) {
      this.productService.createProduct(this.productForm.getRawValue()).subscribe(() => {
        this.productForm.reset({
          name: '',
          price: 0,
          description: '',
          imageUrl: '',
          categoryId: '',
        });
      });
    }
  }
}
