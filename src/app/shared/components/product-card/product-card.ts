import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router'; // Added RouterLink
import { Product } from '../../../models/api.models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink], // Added RouterLink
  template: `
    <div class="card" [routerLink]="['/products', product().id]">
      <!-- Use NgOptimizedImage for better performance, assuming the backend can serve relative paths -->
      <img
        [ngSrc]="imageUrlPrefix + product().imageUrl"
        [alt]="product().name"
        width="300"
        height="200"
        priority
      />
      <div class="content">
        <span class="category">{{ product().category?.name || 'Uncategorized' }}</span>
        <h3>{{ product().name }}</h3>
        <p>{{ product().description }}</p>
        <div class="footer">
          <span class="price">{{ product().price | currency }}</span>
          <button class="add-to-cart-btn" (click)="addToCart.emit(product())">Add to Cart</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  imageUrlPrefix = environment.apiUrl.replace('/api', ''); // Assumes images are served from root of the host
  // v21 Signal-based Inputs
  product = input.required<Product>();

  // v21 Signal-based Outputs
  addToCart = output<Product>();
}
