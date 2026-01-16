import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../models/api.models';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // State: items in the cart
  private cartItems = signal<CartItem[]>([]);

  // Derived state: total count and total price
  itemsCount = computed(() => this.cartItems().reduce((total, item) => total + item.quantity, 0));

  totalPrice = computed(() =>
    this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0)
  );

  items = computed(() => this.cartItems());

  addToCart(product: Product) {
    this.cartItems.update((items) => {
      const existingItem = items.find((i) => i.id === product.id);
      if (existingItem) {
        return items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }

  removeFromCart(productId: string) {
    this.cartItems.update((items) => items.filter((i) => i.id !== productId));
  }

  clearCart() {
    this.cartItems.set([]);
  }

  placeOrder() {
    const items = this.cartItems();
    if (items.length === 0) return;

    console.log('Placing order for:', items);
    // Simulate API call
    alert(`Order placed successfully! Total: $${this.totalPrice()}`);
    this.clearCart();
  }
}
