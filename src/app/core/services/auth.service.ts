import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthResponse, User } from '../../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root', // Industry standard: available everywhere
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // 1. Reactive State (Signals)
  // We initialize the token from localStorage so login persists on refresh
  currentUser = signal<User | null>(null);
  token = signal<string | null>(localStorage.getItem('token'));

  // 2. Computed State
  // This automatically becomes 'true' if token has a value
  isAuthenticated = computed(() => !!this.token());

  // 3. Login Method
  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.setSession(res);
      })
    );
  }

  // 4. Signup Method
  signup(userData: { name: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData).pipe(
      tap((res) => {
        this.setSession(res);
      })
    );
  }

  // 5. Logout Method
  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // Helper logic to update state
  private setSession(authResponse: AuthResponse) {
    localStorage.setItem('token', authResponse.token);
    this.token.set(authResponse.token);
    this.currentUser.set(authResponse.user);
  }
}
