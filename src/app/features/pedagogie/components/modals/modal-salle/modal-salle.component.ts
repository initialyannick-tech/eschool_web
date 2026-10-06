import { Component, EventEmitter, Input, Output, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../../core/services/api.service';
import { ShareService } from '../../../../../core/services/share.service';
import { Salle } from '../../../models/salle';

@Component({
  selector: 'app-modal-salle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-salle.component.html',
  styleUrls: ['./modal-salle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalSalleComponent {
  private apiService = inject(ApiService);
  private shareService = inject(ShareService);
  modal = inject(NgbActiveModal);

  @Input() salle: Salle | null = null;
  @Input() salleToEdit: Salle | null = null; // conservé pour compatibilité
  @Input() isEdit: boolean = false;
  @Output() saved = new EventEmitter<void>();

  isSubmit = false;
  backendErrors: string[] = [];

  salleForm = new FormGroup({
    code: new FormControl('', [Validators.required]),
    nom: new FormControl('', [Validators.required]),
    capacite: new FormControl(1, [Validators.required, Validators.min(1)]),
    type: new FormControl('standard', [Validators.required])
  });

  ngOnInit(): void {
    // compatibilité : on accepte salle ou salleToEdit
    const current = this.salle || this.salleToEdit;
    if (current) {
      this.isEdit = true;
      this.salleForm.patchValue({
        code: current.code,
        nom: current.nom,
        capacite: current.capacite,
        type: current.type || 'standard'
      });
    } else {
      this.salleForm.reset({ capacite: 1, type: 'standard' });
    }
  }

  ngOnChanges(): void {
    const current = this.salle || this.salleToEdit;
    if (current) {
      this.isEdit = true;
      this.salleForm.patchValue({
        code: current.code,
        nom: current.nom,
        capacite: current.capacite,
        type: current.type || 'standard'
      });
    } else {
      this.salleForm.reset({ capacite: 1, type: 'standard' });
    }
  }

  close(): void {
    this.modal.close();
  }

  save(): void {
    if (this.salleForm.invalid) {
      this.salleForm.markAllAsTouched();
      this.backendErrors = ['Veuillez remplir correctement tous les champs obligatoires.'];
      return;
    }

    this.isSubmit = true;
    this.backendErrors = [];
    const data = this.salleForm.value;
    const current = this.salle || this.salleToEdit;

    const request = (current && current.id)
      ? this.apiService.put(`salles/${current.id}`, data)
      : this.apiService.post('salles', data);

    request
      .then((res: any) => {
        this.isSubmit = false;
        if (res.success !== false) {
          if (current) {
            this.shareService.sweetSuccessUpdate();
          } else {
            this.shareService.sweetSuccessInsert();
          }
          this.saved.emit();
          this.modal.dismiss('save');
        } else {
          this.backendErrors = [res.message || 'Une erreur est survenue.'];
        }
      })
      .catch((err: any) => {
        this.isSubmit = false;
        const response = err?.error;

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
        } else {
          this.backendErrors = [
            response?.message || err?.message || 'Une erreur est survenue lors de l’enregistrement.'
          ];
        }
      });
  }
}