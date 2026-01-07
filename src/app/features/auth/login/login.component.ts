import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Best practice for Zoneless/Signals
})
export default class LoginComponent {
  // 1. Dependencies
  private authService = inject(AuthService);
  private router = inject(Router);

  // 2. UI State (Signals)
  email = signal('');
  password = signal('');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // 3. Logic
  async handleLogin() {
    // Basic validation
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please enter both email and password.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials = {
      email: this.email(),
      password: this.password(),
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        // Success: Redirect to products
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isLoading.set(false);
        // Display the specific message from your Express Global Error Handler
        this.errorMessage.set(err.error?.message || 'Login failed. Please try again.');
      },
    });
  }
}
