import {Component, inject, Input} from '@angular/core';
import {ApiService} from '../../../../core/services/api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ShareService} from '../../../../core/services/share.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-modal-role',
  standalone: true,
  templateUrl: './modal-role.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./modal-role.component.scss']
})
export class ModalRoleComponent {
  @Input() role: any
  @Input() isEdit: boolean = false

  apiService = inject(ApiService)
  modal = inject(NgbActiveModal)
  shareService = inject(ShareService)

  roleForm!: FormGroup
  isSubmit = false;
  permissionItems: any[] = []
  permissionsSelected: any[] = []


  ngOnInit() {
    this.permissions()
    this.roleForm = new FormGroup({
      libelle: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      permissions: new FormControl([], [Validators.required, Validators.minLength(1)]),
    })

    if (this.isEdit && this.role) {
      this.roleForm.patchValue({
        libelle: this.role.libelle,
        description: this.role.description,
        permissions: this.role.permissions.map((p: any) => p.id),
      });
    }

  }

  close() {
    this.modal.close()
  }


  permissions() {
    this.apiService.get('role/permissions').then((data: any) => {
      data.forEach((element: any) => {
        element.checked = false
      })
      this.permissionItems = data
    })
  }

  submit() {
    this.roleForm.value.permissions = this.permissionsSelected
    console.log(this.roleForm.value)
    console.log(this.roleForm.valid)
    if (this.isEdit) {
      this.apiService.put('role/' + this.role.id, this.roleForm.value).then((data: any) => {
        if (data.success) {
          this.shareService.sweetSuccessUpdate()
          this.modal.dismiss('save')
          this.isSubmit = false;
        } else {
          this.shareService.sweetAlertError(data.message)
          this.isSubmit = false;
        }
      })
    } else {
      this.apiService.post('role', this.roleForm.value).then((data: any) => {
        if (data.success) {
          this.shareService.sweetSuccessInsert()
          this.modal.dismiss('save')
          this.isSubmit = false;
        } else {
          this.shareService.sweetAlertError(data.message)
          this.isSubmit = false;
        }
      })
    }

    console.log(this.roleForm.value)
  }


  /**
   * Sélectionner une permission
   * */
  checkPerm(event: any) {
    const checked = event.target.checked
    const value = parseInt(event.target.value);
    if (checked === true) {
      this.permissionsSelected.push(value);
    } else {
      const index = this.permissionsSelected.indexOf(value);
      this.permissionsSelected.splice(index, 1)
    }
  }

}
