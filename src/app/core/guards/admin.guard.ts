import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../models/api.models';

export const AdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use the computed signal directly
  const isAdmin = authService.isAdmin();

  if (isAdmin) {
    return true;
  }

  // If not admin, redirect to dashboard
  return router.createUrlTree(['/dashboard']);
};
