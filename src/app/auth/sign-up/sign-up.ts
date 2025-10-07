import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../service/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp implements OnInit {
  signUpForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    const togglePassword = document.querySelector(
      '#togglePassword'
    ) as HTMLElement | null;
    const password = document.querySelector(
      '#password'
    ) as HTMLInputElement | null;

    if (togglePassword && password) {
      togglePassword.addEventListener('click', function (): void {
        const currentType = password.getAttribute('type');
        const type = currentType === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        const icon = this.querySelector('i');
        if (icon) {
          icon.classList.toggle('bi-eye');
          icon.classList.toggle('bi-eye-slash');
        }
      });
    }
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    return password &&
      confirmPassword &&
      password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const formValue = this.signUpForm.value;
      const registerData = {
        username: `${formValue.firstName} ${formValue.lastName}`,
        email: formValue.email,
        password: formValue.password,
      };
      this.authService.register(registerData).subscribe({
        next: (response) => {
          // After successful registration, auto-login the user
          this.authService
            .login({ email: formValue.email, password: formValue.password })
            .subscribe({
              next: (loginResponse) => {
                this.isLoading = false;
                this.router.navigate(['/']);
              },
              error: (loginError) => {
                this.isLoading = false;
                this.errorMessage =
                  'Registration successful, but login failed. Please sign in manually.';
                this.router.navigate(['/signin']);
              },
            });
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed';
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signUpForm.controls).forEach((key) => {
      const control = this.signUpForm.get(key);
      control?.markAsTouched();
    });
  }
}
