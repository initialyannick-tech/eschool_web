import {CommonModule} from '@angular/common';
import {Component, inject, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../../core/services/api.service';
import {ShareService} from '../../../../../core/services/share.service';


@Component({
  selector: 'app-modal-parent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-parent.component.html',
  styleUrls: ['./modal-parent.component.scss']
})
export class ModalParentComponent {
  @Input() parent: any
  @Input() isEdit: boolean = false

  modal = inject(NgbActiveModal)
  apiService = inject(ApiService)
  shareService = inject(ShareService)

  parentForm!: FormGroup
  isSubmit: boolean = false;

  backendErrors: string[] = [];


  ngOnInit() {

    console.log(this.parent);
    this.parentForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      telephone: new FormControl(''),
      telephone_secondaire: new FormControl(''),
      email: new FormControl(''),
      adresse: new FormControl('', [Validators.required]),
      profession: new FormControl(''),
      statut : new FormControl(''),
      observation : new FormControl(''),
    })

    if (this.isEdit) {
      this.parentForm.patchValue({
        nom: this.parent.nom,
        prenom: this.parent.prenom,
        telephone: this.parent.telephone,
        telephone_secondaire: this.parent.telephone_secondaire,
        email: this.parent.email,
        adresse: this.parent.adresse,
        profession: this.parent.profession,
        statut: this.parent.statut,
        observation: this.parent.observation
      })
    }
  }

  close() {
    this.modal.close()
  }

  submit() {
    if (this.parentForm.valid) {
      this.isSubmit = true;
      this.backendErrors = [];
      const request = this.isEdit ? this.apiService.put('parents/' + this.parent.id,
        this.parentForm.value) : this.apiService.post('parents',
        this.parentForm.value);request.then((data: any) => {
        console.log('Réponse backend :', data);
        if (data.success) {
          this.isSubmit = false;
          if (this.isEdit) {
            this.shareService.sweetSuccessUpdate();
          } else {
            this.shareService.sweetSuccessInsert();
          }
          this.modal.dismiss('save');
        }
        else {
          this.isSubmit = false;
          console.error('Erreur backend :', data);
          this.backendErrors = [
            data.message || 'Une erreur est survenue.'
          ];
        }
      }).catch((error: any) => {
        this.isSubmit = false;
        console.error('Erreur HTTP complète :', error);
        const response = error?.error;
        console.error('Réponse Laravel :', response);
        /*
         * ================================================
         * ERREURS DE VALIDATION LARAVEL
         * ================================================
         */
        if (response?.errors) {
          this.backendErrors = [];
          Object.keys(response.errors).forEach(field => {
            const errors = response.errors[field];
            if (Array.isArray(errors)) {
              errors.forEach((message: string) => {
                this.backendErrors.push(message);
              });
            } else {
              this.backendErrors.push(errors);
            }
          });
          console.log('Erreurs à afficher :', this.backendErrors);
        }
        else {
          /*
           * ================================================
           * AUTRE ERREUR BACKEND
           * ================================================
           */
          this.backendErrors = [response?.message || error?.message || 'Une erreur est survenue lors de l’enregistrement.'];
        }
      });
    } else {
      this.parentForm.markAllAsTouched();
    }
  }


}
