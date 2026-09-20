import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from '../../../../../core/services/api.service';
import {ShareService} from '../../../../../core/services/share.service';

@Component({
  selector: 'app-modal-parent-eleve',
  standalone: true,
  templateUrl: './modal-parent-eleve.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./modal-parent-eleve.component.scss']
})
export class ModalParentEleveComponent  {

  parentEleveForm!: FormGroup;
  activeTab: 'parent' | 'eleve' = 'parent';
  isSubmit = false;
  backendErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private apiService: ApiService,
    private shareService: ShareService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.parentEleveForm = this.fb.group({
      parent: this.fb.group({
        nom: ['', [Validators.required, Validators.maxLength(100)]],
        prenom: ['', [Validators.required, Validators.maxLength(100)]],
        relation: ['', Validators.required],
        telephone: ['', [Validators.required, Validators.maxLength(30)]],
        email: ['', Validators.email],
        adresse: [''],
        responsable_principal: [true],
        responsable_financier: [false]
      }),

      eleve: this.fb.group({
        nom: ['', [Validators.required, Validators.maxLength(100)]],
        prenom: ['', [Validators.required, Validators.maxLength(100)]],
        sexe: ['', Validators.required],
        date_naissance: ['', Validators.required],
        lieu_naissance: ['', [Validators.required, Validators.maxLength(150)]],
        nationalite: ['Gabonaise', Validators.maxLength(100)],
        adresse: [''],
        telephone: ['', Validators.maxLength(30)],
        email: ['', Validators.email],
        photo: [''],
        situation_particuliere: [''],
        statut: ['preinscrit', Validators.required]
      })
    });
  }

  setTab(tab: 'parent' | 'eleve'): void {
    this.activeTab = tab;
  }

  nextTab(): void {
    const parent = this.parentEleveForm.get('parent');
    if (parent?.invalid) {
      parent.markAllAsTouched();
      return;
    }
    this.activeTab = 'eleve';
  }

  previousTab(): void {
    this.activeTab = 'parent';
  }

  submit(): void {
    this.backendErrors = [];

    if (this.parentEleveForm.invalid) {
      this.parentEleveForm.markAllAsTouched();

      if (this.parentEleveForm.get('parent')?.invalid) {
        this.activeTab = 'parent';
      } else {
        this.activeTab = 'eleve';
      }

      return;
    }

    this.isSubmit = true;

    const parentData = this.parentEleveForm.get('parent')?.value;
    const eleveData = this.parentEleveForm.get('eleve')?.value;

    this.apiService.post('parents', parentData)
      .then((parentResponse: any) => {

        if (!parentResponse?.success) {
          throw new Error(
            parentResponse?.message ||
            'Impossible d’enregistrer le parent.'
          );
        }

        const parentId = parentResponse?.data?.id;

        if (!parentId) {
          throw new Error(
            'Le parent a été créé mais son identifiant est introuvable.'
          );
        }

        return this.apiService.post('eleves', {
          ...eleveData,
          parent_id: parentId
        });
      })

      .then((eleveResponse: any) => {

        if (!eleveResponse?.success) {
          throw new Error(
            eleveResponse?.message ||
            'Impossible d’enregistrer l’élève.'
          );
        }

        this.isSubmit = false;

        this.shareService.sweetSuccessInsert();

        this.modal.dismiss('save');
      })

      .catch((error: any) => {

        this.isSubmit = false;

        const response = error?.error;

        if (response?.errors) {
          this.backendErrors = Object.values(response.errors)
            .flat()
            .map((message: any) => String(message));

          const parentFields = [
            'nom',
            'prenom',
            'relation',
            'telephone',
            'email',
            'adresse',
            'responsable_principal',
            'responsable_financier'
          ];

          const hasParentError = Object.keys(response.errors)
            .some(field => parentFields.includes(field));

          this.activeTab = hasParentError
            ? 'parent'
            : 'eleve';

          return;
        }

        this.backendErrors = [
          response?.message ||
          error?.message ||
          'Une erreur est survenue lors de l’enregistrement.'
        ];
      });
  }

  close(): void {
    this.modal.dismiss('cancel');
  }

  isInvalid(group: string, field: string): boolean {
    const control = this.parentEleveForm
      .get(group)
      ?.get(field);

    return !!(
      control &&
      control.invalid &&
      control.touched
    );
  }

  hasError(
    group: string,
    field: string,
    error: string
  ): boolean {
    const control = this.parentEleveForm
      .get(group)
      ?.get(field);

    return !!(
      control &&
      control.hasError(error) &&
      control.touched
    );
  }
}
