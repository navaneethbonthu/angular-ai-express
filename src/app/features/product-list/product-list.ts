import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  effect,
  computed,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter, startWith, switchMap } from 'rxjs';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/api.models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, ReactiveFormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductListComponent implements OnInit {
  productService = inject(ProductService);

  // State for filtering and pagination
  searchControl = new FormControl('');
  selectedCategory = signal<string | undefined>(undefined);
  currentPage = signal<number>(1);
  itemsPerPage = this.productService.itemsPerPage; // Use service's signal

  // Computed state for pagination controls
  totalPages = this.productService.totalPages;
  totalItems = this.productService.totalItems;

  constructor() {
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
    console.log('Adding to cart:', product.name);
    // TODO: Implement cart service logic here
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
}
