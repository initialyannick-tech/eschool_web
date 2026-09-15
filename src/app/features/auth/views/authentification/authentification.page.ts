import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiService} from '../../../../core/services/api.service';
import {ShareService} from '../../../../core/services/share.service';
import {CookieService} from '../../../../core/services/cookie.service';

@Component({
  selector: 'app-authentification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './authentification.page.html',
  styleUrls: ['./authentification.page.scss']
})
export class AuthentificationPage {
  isSubmit: boolean = false;
  loginForm!: FormGroup;

  apiService = inject(ApiService)
  shareService = inject(ShareService)
  cookieService = inject(CookieService)

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }


  login() {
    if (this.loginForm.valid) {
      this.isSubmit = true;
      this.apiService.post('auth/login', this.loginForm.value).then((data: any) => {
        if (data.success) {
          this.cookieService.setCookie('token', data.data.token, 1);
          this.cookieService.setCookie('userConnected', data.data.user, 1);
          this.cookieService.setCookie('permissions', data.data.permissions, 1);
          window.location.href = '/dashboard';
        } else {
          this.isSubmit = false;
          this.shareService.sweetAlertError(data.message)
        }
      })

    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  isLoading() {
    return false;
  }

  // Dans votre composant Login

  togglePasswordVisibility() {
    const passwordInput = document.querySelector('input[formControlName="password"]') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    }
  }
}
