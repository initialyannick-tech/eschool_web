import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../../core/services/api.service';
import {ShareService} from '../../../../../core/services/share.service';

@Component({
  selector: 'app-modal-matiere',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-matiere.component.html',
  styleUrls: ['./modal-matiere.component.scss']
})
export class ModalMatiereComponent {

  @Input() matiere: any
  @Input() isEdit: boolean = false

  apiService = inject(ApiService);
  modal = inject(NgbActiveModal);
  shareService = inject(ShareService)
  isSubmit: boolean = false;
  backendErrors: string[] = [];
  matiereForm!: FormGroup


  ngOnInit() {

    console.log(this.matiere);
    this.matiereForm = new FormGroup({
      libelle: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      description: new FormControl(''),
      actif: new FormControl(true)
    })

    if (this.isEdit) {
      this.matiereForm.patchValue({
        libelle: this.matiere.libelle ?? '',
        description: this.matiere.description ?? '',
        actif: this.matiere.actif ?? true,
      })
    }
  }

  close() {
    this.modal.close()
  }

  submit() {
    if (this.matiereForm.valid) {
      this.isSubmit = true;
      this.backendErrors = [];
      const request = this.isEdit ? this.apiService.put('matiere/' + this.matiere.id, this.matiereForm.value) : this.apiService.post('matiere', this.matiereForm.value);
      request.then((data: any) => {
        console.log('Réponse backend :', data);
        if (data.success) {
          this.isSubmit = false;
          if (this.isEdit) {
            this.shareService.sweetSuccessUpdate();
          } else {
            this.shareService.sweetSuccessInsert();
          }
          this.modal.dismiss('save');
        } else {
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
        } else {
          this.backendErrors = [response?.message || error?.message || 'Une erreur est survenue lors de l’enregistrement.'];
        }
      });
    } else {
      this.matiereForm.markAllAsTouched();
    }
  }
}
