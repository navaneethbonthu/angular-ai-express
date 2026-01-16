import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  effect,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../models/api.models';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductFormComponent } from './product-form.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import CategoryManagerComponent from '../category-manager/category-manager.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductCardComponent,
    ReactiveFormsModule,
    ProductFormComponent,
    ModalComponent,
    CategoryManagerComponent,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductListComponent implements OnInit {
  productService = inject(ProductService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  isAdmin = this.authService.isAdmin;

  productModal = viewChild<ModalComponent>('productModal');
  categoryModal = viewChild<ModalComponent>('categoryModal');

  // State for filtering and pagination
  searchControl = new FormControl('');
  selectedCategory = signal<string | undefined>(undefined);
  currentPage = signal<number>(1);
  itemsPerPage = this.productService.itemsPerPage;

  // Computed state for pagination controls
  totalPages = this.productService.totalPages;
  totalItems = this.productService.totalItems;

  constructor() {
    // Handle search input debouncing
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.currentPage.set(1);
      });

    // Effect to react to filter/pagination changes
    effect(() => {
      const search = this.searchControl.value ?? '';
      const categoryId = this.selectedCategory();
      const page = this.currentPage();

      // Trigger product loading when any filter/page state changes
      this.productService.loadProducts(page, this.itemsPerPage(), search, categoryId).subscribe();
    });
  }

  ngOnInit() {
    // Load categories once
    this.productService.fetchCategories().subscribe();
  }

  handleAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  handleDeleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe();
    }
  }

  // Event handlers
  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = selectElement.value === '' ? undefined : selectElement.value;
    this.selectedCategory.set(categoryId);
    this.currentPage.set(1); // Reset to first page on category change
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

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
