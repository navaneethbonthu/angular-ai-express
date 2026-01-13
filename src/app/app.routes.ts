import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component'),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component'),
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () => import('./features/product-list/product-list'),
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () => import('./features/category-manager/category-manager.component'),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
