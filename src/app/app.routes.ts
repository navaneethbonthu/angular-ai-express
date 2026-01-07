import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component'), // Simplified thanks to 'export default'
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
