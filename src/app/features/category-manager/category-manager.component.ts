import { ChangeDetectionStrategy, Component, inject, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-category-manager',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="category-manager" aria-labelledby="cat-title">
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
        <h3 id="cat-title">Existing Categories</h3>
        @if (categoryService.categories().length === 0) {
        <p class="empty-state">No categories found.</p>
        } @else {
        <ul>
          @for (cat of categoryService.categories(); track cat.id) {
          <li>
            <span class="cat-name">{{ cat.name }}</span>
            <span class="count">{{ cat._count?.products || 0 }} products</span>
          </li>
          }
        </ul>
        }
      </div>
    </section>
  `,
  styleUrl: './category-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoryManagerComponent implements OnInit {
  categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  categoryAdded = output<void>();

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
        this.categoryAdded.emit();
      });
    }
  }
}
