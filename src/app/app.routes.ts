import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

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
    path: 'admin',
    canActivate: [authGuard, AdminGuard],
    loadComponent: () => import('./features/admin/admin-panel.component'),
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () => import('./features/product-list/product-list'),
  },
  {
    path: 'categories',
    canActivate: [authGuard, AdminGuard],
    loadComponent: () => import('./features/category-manager/category-manager.component'),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
