import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../../core/services/api.service';
import {ShareService} from '../../../../../core/services/share.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-modal-eleve',
  standalone: true,
  templateUrl: './modal-eleve.component.html',
  imports: [ReactiveFormsModule, NgClass],
  styleUrls: ['./modal-eleve.component.scss']
})
export class ModalEleveComponent {

  @Input() eleve: any
  @Input() isEdit: boolean = false

  modal = inject(NgbActiveModal)
  apiService = inject(ApiService)
  shareService = inject(ShareService)

  eleveForm!: FormGroup
  isSubmit: boolean = false;
  backendErrors: string[] = [];

  ngOnInit() {

    console.log(this.eleve);
    this.eleveForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      sexe: new FormControl('', [Validators.required]),
      date_naissance: new FormControl('', [Validators.required]),
      lieu_naissance: new FormControl('', [Validators.required]),
      nationalite: new FormControl('', [Validators.required]),
      adresse: new FormControl(''),
      telephone: new FormControl(''),
      photo: new FormControl(''),
      email: new FormControl(''),
      situation_particuliere : new FormControl('', [Validators.required]),
      statut: new FormControl(''),
    })

    if (this.isEdit) {
      this.eleveForm.patchValue({
        nom: this.eleve.nom,
        prenom: this.eleve.prenom,
        sexe: this.eleve.sexe,
        date_naissance: this.eleve.date_naissance,
        lieu_naissance: this.eleve.lieu_naissance,
        nationalite: this.eleve.nationalite,
        adresse: this.eleve.adresse,
        telephone: this.eleve.telephone,
        photo: this.eleve.photo,
        email: this.eleve.email,
        situation_particuliere: this.eleve.situation_particuliere,
        statut: this.eleve.statut,
      })
    }
  }

  close() {
    this.modal.close()
  }

  submit() {
    if (this.eleveForm.valid) {
      this.isSubmit = true;
      this.backendErrors = [];
      const request = this.isEdit ? this.apiService.put('eleves/' + this.eleve.id, this.eleveForm.value) : this.apiService.post('eleves', this.eleveForm.value);request.then((data: any) => {
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
      this.eleveForm.markAllAsTouched();
    }
  }
}
