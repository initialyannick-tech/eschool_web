import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../../core/services/api.service';
import {Parent} from '../../../models/parent';

@Component({
  selector: 'app-modal-parent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-parent.component.html',
  styleUrls: ['./modal-parent.component.scss']
})
export class ModalParentComponent {
  @Input() parent!: Parent;

  form!: FormGroup;
  isSubmitting = false;
  errors: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nom: [this.parent.nom ?? '', [Validators.required, Validators.maxLength(255)]],
      prenom: [this.parent.prenom ?? '', [Validators.required, Validators.maxLength(255)]],
      telephone: [this.parent.telephone ?? '', [Validators.required, Validators.maxLength(30)]],
      telephone_secondaire: [this.parent.telephone_secondaire ?? '', Validators.maxLength(30)],
      email: [this.parent.email ?? '', Validators.email],
      adresse: [this.parent.adresse ?? ''],
      profession: [this.parent.profession ?? ''],
      lieu_travail: [this.parent.lieu_travail ?? ''],
      statut: [this.parent.statut ?? 'actif', Validators.required],
      observation: [this.parent.observation ?? '']
    });
  }

  save(): void {
    this.errors = [];
    if (this.form.invalid || !this.parent.id) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.apiService.put(`parents/${this.parent.id}`, this.form.getRawValue())
      .then((response: any) => {
        if (!response?.success) {
          throw new Error(response?.message || 'Impossible de modifier le parent.');
        }
        this.modal.dismiss('save');
      })
      .catch((error: any) => {
        const response = error?.error;
        this.errors = response?.errors
          ? Object.values(response.errors).flat().map((message: any) => String(message))
          : [response?.message || error?.message || 'Une erreur est survenue.'];
      })
      .finally(() => this.isSubmitting = false);
  }

  close(): void {
    this.modal.dismiss('cancel');
  }
}
