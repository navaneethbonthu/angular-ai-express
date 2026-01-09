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
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  imageUrlPrefix = environment.apiUrl.replace('/api', ''); // Assumes images are served from root of the host
  // v21 Signal-based Inputs
  product = input.required<Product>();

  // v21 Signal-based Outputs
  addToCart = output<Product>();
  delete = output<string>();
}
