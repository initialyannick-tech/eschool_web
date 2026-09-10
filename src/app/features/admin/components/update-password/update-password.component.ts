import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../core/services/api.service';
import {ShareService} from '../../../../core/services/share.service';
import {CookieService} from '../../../../core/services/cookie.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-update-password',
  standalone: true,
  templateUrl: './update-password.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent {
  @Input() user: any

  modal = inject(NgbActiveModal)
  apiService = inject(ApiService)
  shareService = inject(ShareService)
  cookieService = inject(CookieService)


  passwordForm!: FormGroup
  isSubmit: boolean = false;
  showPassword: boolean = false;
  backendErrors: any = {}

  ngOnInit() {
    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password_confirmation: new FormControl('', [Validators.required, Validators.minLength(6)]),
      user_id: new FormControl(this.user.id, [Validators.required]),
    })
  }

  close() {
    this.modal.close()
  }


  showPasswordInput() {
    this.showPassword = !this.showPassword
  }

  submit() {
    if (this.passwordForm.valid) {
      this.isSubmit = true
      this.apiService.put('auth/change-password', this.passwordForm.value).then((data: any) => {
        if (data.success) {
          this.isSubmit = false
          this.shareService.sweetSuccessUpdate()
          console.log(data.data)
          this.cookieService.setCookie('userConnected', data.data, 1);
          this.modal.close()
        } else {
          this.isSubmit = false
          this.shareService.sweetAlertError("Erreur")
        }
      }).catch((error) => {
        this.isSubmit = false
        this.backendErrors = error.error.errors
      })
    } else {
      this.passwordForm.markAllAsTouched()
    }

  }

}
