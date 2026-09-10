import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../core/services/api.service';
import {ShareService} from '../../../../core/services/share.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-modal-metier',
  standalone: true,
  templateUrl: './modal-metier.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgSelectComponent
  ],
  styleUrls: ['./modal-metier.component.scss']
})
export class ModalMetierComponent {

  @Input() metier: any
  @Input() isEdit: boolean = false

  modal = inject(NgbActiveModal)
  apiService = inject(ApiService)
  shareService = inject(ShareService)

  metierForm!: FormGroup
  isSubmit: boolean = false;
  backendErrors: any = {}

  departements: any[] = []

  ngOnInit() {
    this.getDepartements()
    this.metierForm = new FormGroup({
      libelle: new FormControl('', [Validators.required]),
      famille: new FormControl(''),
      service_id: new FormControl('', [Validators.required]),
    })

    if (this.isEdit) {
      this.metierForm.patchValue(this.metier)
    }
  }

  close() {
    this.modal.close()
  }

  submit() {
    if (this.metierForm.valid) {
      this.isSubmit = true
      if (this.isEdit) {
        this.apiService.put('metiers/' + this.metier.id, this.metierForm.value).then((data: any) => {
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
        this.apiService.post('metiers', this.metierForm.value).then((data: any) => {
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
      this.metierForm.markAllAsTouched()
    }
  }


  getDepartements() {
    this.apiService.get('services/liste').then((data: any) => {
      this.departements = data.data
    })
  }
}
