import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component'),
  },
  {
    path: 'products',
    // lazy load the product list
    loadComponent: () => import('./features/product-list/product-list'),
  },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
];
