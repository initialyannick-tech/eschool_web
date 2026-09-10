import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../core/services/api.service';
import {ShareService} from '../../../../core/services/share.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-modal-poste',
  standalone: true,
  templateUrl: './modal-poste.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgSelectComponent
  ],
  styleUrls: ['./modal-poste.component.scss']
})
export class ModalPosteComponent {

  @Input() poste: any
  @Input() isEdit: boolean = false

  modal = inject(NgbActiveModal)
  apiService = inject(ApiService)
  shareService = inject(ShareService)

  posteForm!: FormGroup
  isSubmit: boolean = false;
  backendErrors: any = {}

  metiers: any[] = []

  ngOnInit() {
    this.getMetiers()
    this.posteForm = new FormGroup({
      libelle: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      actif: new FormControl(true),
      metier_id: new FormControl(''),
    })

    if (this.isEdit) {
      this.posteForm.patchValue(this.poste)
    }
  }

  close() {
    this.modal.close()
  }

  submit() {
    if (this.posteForm.valid) {
      this.isSubmit = true
      if (this.isEdit) {
        this.apiService.put('poste/' + this.poste.id, this.posteForm.value).then((data: any) => {
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
        this.apiService.post('poste', this.posteForm.value).then((data: any) => {
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
      this.posteForm.markAllAsTouched()
    }
  }


  getMetiers() {
    this.apiService.get('metiers/liste').then((data: any) => {
      this.metiers = data.data
    })
  }




}
