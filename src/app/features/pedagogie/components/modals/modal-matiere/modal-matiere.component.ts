import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../../core/services/api.service';

@Component({
  selector: 'app-modal-matiere',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-matiere.component.html',
  styleUrls: ['./modal-matiere.component.scss']
})
export class ModalMatiereComponent {
  apiService = inject(ApiService);
  modal = inject(NgbActiveModal);

  isEdit = false;
  matiere: any = null;

  matiereForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    libelle: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    description: new FormControl(''),
    actif: new FormControl(true)
  });

  ngOnInit() {
    if (this.isEdit && this.matiere) {
      this.matiereForm.patchValue({
        code: this.matiere.code ?? '',
        libelle: this.matiere.libelle ?? '',
        description: this.matiere.description ?? '',
        actif: this.matiere.actif ?? true,
      });
    }
  }

  close() {
    this.modal.close();
  }

  submit() {
    if (this.matiereForm.invalid) {
      this.matiereForm.markAllAsTouched();
      return;
    }

    const payload = this.matiereForm.getRawValue();
    const request: Promise<any> = this.isEdit
      ? this.apiService.put('matiere/' + this.matiere.id, payload)
      : this.apiService.post('matiere', payload);

    request.then((response: any) => {
      if (response?.success) {
        this.modal.close('save');
      }
    }).catch((error: any) => {
      console.error('Erreur de sauvegarde de la matière', error);
    });
  }
}
