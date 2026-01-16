import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  user = computed(() => this.authService.currentUser());
  isAdmin = this.authService.isAdmin;
  cartCount = this.cartService.itemsCount;

  placeOrder() {
    this.cartService.placeOrder();
  }
}
