import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../core/services/api.service';
import {ShareService} from '../../../../core/services/share.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-modal-departement',
  standalone: true,
  templateUrl: './modal-departement.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./modal-departement.component.scss']
})
export class ModalDepartementComponent {

  @Input() departement: any
  @Input() isEdit: boolean = false

  modal = inject(NgbActiveModal)
  apiService = inject(ApiService)
  shareService = inject(ShareService)

  departementForm!: FormGroup
  isSubmit: boolean = false;
  backendErrors: any = {}

  ngOnInit() {
    this.departementForm = new FormGroup({
      libelle: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    })

    if (this.isEdit) {
      this.departementForm.patchValue(this.departement)
    }
  }

  close() {
    this.modal.close()
  }

  submit() {
    if (this.departementForm.valid) {
      this.isSubmit = true
      if (this.isEdit) {
        this.apiService.put('services/' + this.departement.id, this.departementForm.value).then((data: any) => {
          if (data.success) {
            this.isSubmit = false
            this.shareService.sweetSuccessUpdate()
            this.modal.dismiss('save')
          } else {
            this.isSubmit = false
            this.shareService.sweetAlertError(data.message)
          }
        }).catch((error: any) => {
          this.backendErrors = error.error.errors
          this.isSubmit = false
        })
      } else {
        this.apiService.post('services', this.departementForm.value).then((data: any) => {
          if (data.success) {
            this.isSubmit = false
            this.shareService.sweetSuccessInsert()
            this.modal.dismiss('save')
          } else {
            this.isSubmit = false
            this.shareService.sweetAlertError(data.message)
          }
        }).catch((error: any) => {
          this.backendErrors = error.error.errors
          this.isSubmit = false
        })
      }

    } else {
      this.departementForm.markAllAsTouched()
    }
  }
}
