import { ChangeDetectionStrategy, Component, input, output, inject, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router'; // Added RouterLink
import { Product } from '../../../models/api.models';
import { AuthService } from '../../../core/services/auth.service';
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
  private authService = inject(AuthService);
  imageUrlPrefix = environment.apiUrl.replace('/api', ''); // Assumes images are served from root of the host

  // v21 Signal-based Inputs
  product = input.required<Product>();

  // Role check
  isAdmin = this.authService.isAdmin;

  // v21 Signal-based Outputs
  addToCart = output<Product>();
  delete = output<string>();
}
