import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="product-form-container" aria-labelledby="form-title">
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
        <div class="form-grid">
          <div class="form-field">
            <label for="name">Product Name</label>
            <input id="name" type="text" formControlName="name" placeholder="Enter product name" />
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
            <input
              id="imageUrl"
              type="text"
              formControlName="imageUrl"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div class="form-field full-width">
            <label for="description">Description</label>
            <textarea
              id="description"
              formControlName="description"
              rows="3"
              placeholder="Describe the product..."
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            [disabled]="productForm.invalid || productService.isLoading()"
            [class.loading]="productService.isLoading()"
          >
            {{ productService.isLoading() ? 'Creating...' : 'Create Product' }}
          </button>
        </div>
      </form>
    </section>
  `,
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent {
  productService = inject(ProductService);
  private fb = inject(FormBuilder);
  productCreated = output<void>();

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
        this.productCreated.emit();
      });
    }
  }
}
