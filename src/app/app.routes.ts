import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component'),
  },
  {
    path: 'products',
    canActivate: [authGuard],
    // lazy load the product list
    loadComponent: () => import('./features/product-list/product-list'),
  },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
];
