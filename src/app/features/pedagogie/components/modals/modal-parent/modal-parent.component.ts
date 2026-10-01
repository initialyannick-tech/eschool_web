import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../../core/services/api.service';
import {ShareService} from '../../../../../core/services/share.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-modal-parent',
  standalone: true,
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


  ngOnInit()
    console.log(this.classe);
    this.parentForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      capacite: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      actif: new FormControl(''),
      annee_scolaire_id: new FormControl('', [Validators.required]),
      cycle_id: new FormControl('', [Validators.required]),
      serie_id: new FormControl(''),
      professeur_principal_id : new FormControl('', [Validators.required]),
    })

    if (this.isEdit) {
      this.parentForm.patchValue({
        nom: this.classe.nom,
        capacite: this.classe.capacite,
        description: this.classe.description,
        actif: this.classe.actif,
        annee_scolaire_id: this.classe.annee_scolaire.id,
        cycle_id: this.classe.cycle.id,
        serie_id: this.classe.serie.id,
        professeur_principal_id: this.classe.professeur_principal.id
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
      const request = this.isEdit ? this.apiService.put('classe/' + this.classe.id, this.classeForm.value) : this.apiService.post('classe', this.classeForm.value);request.then((data: any) => {
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
      this.classeForm.markAllAsTouched();
    }
  }
}
