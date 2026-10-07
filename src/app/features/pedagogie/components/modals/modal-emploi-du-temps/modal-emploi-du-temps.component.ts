import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../../core/services/api.service';
import { ShareService } from '../../../../../core/services/share.service';
import { EmploiDuTemps } from '../../../models/emploi-du-temps';
import { Salle } from '../../../models/salle';

@Component({
  selector: 'app-modal-emploi-du-temps',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-emploi-du-temps.component.html',
  styleUrls: ['./modal-emploi-du-temps.component.scss'],
  encapsulation: ViewEncapsulation.None   // ⬅️ IMPORTANT (hérite des styles .classe-modal globaux)
})
export class ModalEmploiDuTempsComponent implements OnInit {
  private apiService = inject(ApiService);
  private shareService = inject(ShareService);
  modal = inject(NgbActiveModal);

  courseToEdit: EmploiDuTemps | null = null;
  selectedClasseId: number | null = null;
  selectedAnneeId = 1;

  isSubmit = false;
  backendErrors: string[] = [];
  dependencyErrors: string[] = [];
  salles: Salle[] = [];
  enseignants: any[] = [];
  matieres: any[] = [];

  joursSemaine = [
    { key: 'lundi', label: 'Lundi' },
    { key: 'mardi', label: 'Mardi' },
    { key: 'mercredi', label: 'Mercredi' },
    { key: 'jeudi', label: 'Jeudi' },
    { key: 'vendredi', label: 'Vendredi' },
    { key: 'samedi', label: 'Samedi' }
  ];

  emploiForm = new FormGroup({
    annee_scolaire_id: new FormControl<number | null>(null, [Validators.required]),
    classe_id: new FormControl<number | null>(null, [Validators.required]),
    matiere_id: new FormControl<number | null>(null, [Validators.required]),
    enseignant_id: new FormControl<number | null>(null, [Validators.required]),
    salle_id: new FormControl<number | null>(null, [Validators.required]),
    jour_semaine: new FormControl('lundi', [Validators.required]),
    heure_debut: new FormControl('08:00', [Validators.required]),
    heure_fin: new FormControl('10:00', [Validators.required]),
    type_cours: new FormControl('CM', [Validators.required])
  });

  ngOnInit(): void {
    this.loadDependencies();
  }

  /**
   * Appelée par le composant parent après modal.open()
   */
  initialize(
    classeId: number | null,
    anneeId: number,
    course: EmploiDuTemps | null
  ): void {
    this.selectedClasseId = classeId;
    this.selectedAnneeId = anneeId;
    this.courseToEdit = course;

    this.emploiForm.reset({
      annee_scolaire_id: course?.annee_scolaire_id ?? anneeId,
      classe_id: classeId,
      matiere_id: course?.matiere_id ?? null,
      enseignant_id: course?.enseignant_id ?? null,
      salle_id: course?.salle_id ?? null,
      jour_semaine: course?.jour_semaine ?? 'lundi',
      heure_debut: course?.heure_debut?.slice(0, 5) ?? '08:00',
      heure_fin: course?.heure_fin?.slice(0, 5) ?? '10:00',
      type_cours: course?.type_cours ?? 'CM'
    });
  }

  close(): void {
    this.modal.close();
  }

  loadDependencies(): void {
    this.apiService.get('salles').then((res: any) => {
      this.salles = res.data || [];
    }).catch((err: any) => {
      this.dependencyErrors.push(err?.error?.message || 'Impossible de charger la liste des salles.');
    });

    this.apiService.get('enseignants').then((res: any) => {
      this.enseignants = res.data || res || [];
    }).catch((err: any) => {
      this.dependencyErrors.push(err?.error?.message || 'Impossible de charger la liste des enseignants.');
    });

    this.apiService.get('matiere/liste').then((res: any) => {
      this.matieres = res.data || res || [];
    }).catch((err: any) => {
      this.dependencyErrors.push(err?.error?.message || 'Impossible de charger la liste des matières.');
    });
  }

  save(): void {
    if (this.emploiForm.invalid) {
      this.emploiForm.markAllAsTouched();
      this.shareService.toastWarning('Veuillez remplir correctement tous les champs obligatoires.');
      return;
    }

    this.isSubmit = true;
    this.backendErrors = [];
    const data = this.emploiForm.value;

    const request = (this.courseToEdit && this.courseToEdit.id)
      ? this.apiService.put(`emplois-du-temps/${this.courseToEdit.id}`, data)
      : this.apiService.post('emplois-du-temps', data);

    request
      .then((res: any) => {
        this.isSubmit = false;
        if (res.success !== false) {
          if (this.courseToEdit) {
            this.shareService.sweetSuccessUpdate();
          } else {
            this.shareService.sweetSuccessInsert();
          }
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