import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn implements OnInit {
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
}
