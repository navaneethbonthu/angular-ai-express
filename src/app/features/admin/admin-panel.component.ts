import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ProductFormComponent } from '../product-list/product-form.component';
import CategoryManagerComponent from '../category-manager/category-manager.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterLink, ModalComponent, ProductFormComponent, CategoryManagerComponent],
  template: `
    <div class="admin-panel-container">
      <header class="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage products, categories, and system settings.</p>
      </header>

      <div class="admin-grid">
        <section class="admin-card" aria-labelledby="product-mgmt">
          <h2 id="product-mgmt">Product Management</h2>
          <p>Create, update, or remove products from the catalog.</p>
          <div class="admin-actions">
            <button class="btn btn-primary" (click)="openProductModal()">+ Add New Product</button>
            <a routerLink="/products" class="btn btn-secondary">View All Products</a>
          </div>
        </section>

        <section class="admin-card" aria-labelledby="cat-mgmt">
          <h2 id="cat-mgmt">Category Management</h2>
          <p>Organize products into logical categories.</p>
          <div class="admin-actions">
            <button class="btn btn-primary" (click)="openCategoryModal()">Manage Categories</button>
          </div>
        </section>

        <section class="admin-card" aria-labelledby="stats-overview">
          <h2 id="stats-overview">Overview</h2>
          <div class="stats-summary">
            <div class="stat-item">
              <span class="stat-label">Total Products:</span>
              <span class="stat-value">{{ productService.totalItems() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Categories:</span>
              <span class="stat-value">{{ categoryService.categories().length }}</span>
            </div>
          </div>
        </section>
      </div>

      <app-modal #productModal>
        <h2 header>Add New Product</h2>
        <app-product-form (productCreated)="onProductCreated()" />
      </app-modal>

      <app-modal #categoryModal>
        <h2 header>Manage Categories</h2>
        <app-category-manager (categoryAdded)="onCategoryAdded()" />
      </app-modal>
    </div>
  `,
  styles: [
    `
      .admin-panel-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .admin-header {
        margin-bottom: 2rem;
        h1 {
          margin: 0;
          font-size: 2.5rem;
        }
        p {
          color: #666;
          margin-top: 0.5rem;
        }
      }
      .admin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }
      .admin-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        h2 {
          margin-top: 0;
          font-size: 1.5rem;
        }
        p {
          color: #555;
          margin-bottom: 1.5rem;
        }
      }
      .admin-actions {
        display: flex;
        gap: 1rem;
      }
      .btn {
        padding: 0.75rem 1.25rem;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-weight: 600;
        text-decoration: none;
        display: inline-block;
        text-align: center;
        &.btn-primary {
          background: #007bff;
          color: white;
        }
        &.btn-secondary {
          background: #6c757d;
          color: white;
        }
      }
      .stats-summary {
        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
          &:last-child {
            border-bottom: none;
          }
        }
        .stat-label {
          font-weight: 500;
        }
        .stat-value {
          font-weight: 700;
          color: #007bff;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminPanelComponent {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);

  productModal = viewChild<ModalComponent>('productModal');
  categoryModal = viewChild<ModalComponent>('categoryModal');

  openProductModal() {
    this.productModal()?.open();
  }

  openCategoryModal() {
    this.categoryModal()?.open();
  }

  onProductCreated() {
    this.productModal()?.close();
  }

  onCategoryAdded() {
    this.categoryModal()?.close();
  }
}
