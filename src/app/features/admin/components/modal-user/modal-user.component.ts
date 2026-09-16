import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../core/services/api.service';
import {ShareService} from '../../../../core/services/share.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-modal-user',
  standalone: true,
  templateUrl: './modal-user.component.html',
  imports: [
    NgSelectComponent,
    ReactiveFormsModule
  ],
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent {
  @Input() user: any
  @Input() isEdit: boolean = false

  modal = inject(NgbActiveModal)
  apiService = inject(ApiService)
  shareService = inject(ShareService)

  userForm!: FormGroup
  isSubmit: boolean = false;
  roles: any[] = []

  ngOnInit() {
    console.log(this.user)
    this.getRoles()
    this.userForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role_id: new FormControl('', [Validators.required]),
    })

    if (this.isEdit) {
      this.userForm = new FormGroup({
        nom: new FormControl(this.user.nom, [Validators.required]),
        prenom: new FormControl(this.user.prenom, [Validators.required]),
        email: new FormControl(this.user.email, [Validators.required, Validators.email]),
        role_id: new FormControl(this.user.role_id, [Validators.required]),
        status: new FormControl(this.user.status, [Validators.required]),
      })
    }
  }

  close() {
    this.modal.close()
  }

  submit() {
    if (this.userForm.valid) {
      this.isSubmit = true
      if (this.isEdit) {
        this.apiService.put('userList/' + this.user.id, this.userForm.value).then((data: any) => {
          if (data.success) {
            this.isSubmit = false
            this.shareService.sweetSuccessUpdate()
            this.modal.dismiss('save')
          } else {
            this.isSubmit = false
            this.shareService.sweetAlertError(data.message)
          }
        })
      } else {
        this.apiService.post('userList', this.userForm.value).then((data: any) => {
          if (data.success) {
            this.isSubmit = false
            this.shareService.sweetSuccessInsert()
            this.modal.dismiss('save')
          } else {
            this.isSubmit = false
            this.shareService.sweetAlertError(data.message)
          }
        })
      }

    } else {
      this.userForm.markAllAsTouched()
    }
  }

  getRoles() {
    this.apiService.get('role/liste').then((data: any) => {
      this.roles = data.data
    })
  }
}
