import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDto } from '../../models/student.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: LoginDto = { username: '', password: '' };
  registerForm = { username: '', password: '' };
  showRegister = false;
  showPassword = false;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  switchMode(toRegister: boolean) {
    this.showRegister = toRegister;
    this.errorMessage = '';
    this.successMessage = '';
    this.submitted = false;
  }

  onLogin() {
    this.submitted = true;
    if (!this.loginForm.username || !this.loginForm.password) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.router.navigate(['/dashboard']);
        else this.errorMessage = res.message;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid username or password';
      }
    });
  }

  
  onRegister() {
    this.submitted = true;
    if (!this.registerForm.username || this.registerForm.password.length < 6) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.router.navigate(['/dashboard']);
        else this.errorMessage = res.message;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    });
  }
}
