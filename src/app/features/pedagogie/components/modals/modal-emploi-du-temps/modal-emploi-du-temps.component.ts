import { Component, EventEmitter, Input, Output, inject, OnInit, OnChanges } from '@angular/core';
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
  styleUrls: ['./modal-emploi-du-temps.component.scss']
})
export class ModalEmploiDuTempsComponent implements OnInit, OnChanges {
  private apiService = inject(ApiService);
  private shareService = inject(ShareService);
  modal = inject(NgbActiveModal);

  @Input() courseToEdit: EmploiDuTemps | null = null;
  @Input() selectedClasseId: number | null = null;
  @Input() selectedAnneeId: number = 1; // Valeur par défaut / dynamique selon l'année active

  isSubmit = false;
  backendErrors: string[] = [];
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

  ngOnChanges(): void {
    if (this.selectedClasseId) {
      this.emploiForm.patchValue({ classe_id: this.selectedClasseId });
    }
    if (this.selectedAnneeId) {
      this.emploiForm.patchValue({ annee_scolaire_id: this.selectedAnneeId });
    }

    if (this.courseToEdit) {
      this.emploiForm.patchValue({
        annee_scolaire_id: this.courseToEdit.annee_scolaire_id,
        classe_id: this.courseToEdit.classe_id,
        matiere_id: this.courseToEdit.matiere_id,
        enseignant_id: this.courseToEdit.enseignant_id,
        salle_id: this.courseToEdit.salle_id,
        jour_semaine: this.courseToEdit.jour_semaine,
        heure_debut: this.courseToEdit.heure_debut,
        heure_fin: this.courseToEdit.heure_fin,
        type_cours: this.courseToEdit.type_cours || 'CM'
      });
    } else {
      this.emploiForm.patchValue({
        heure_debut: '08:00',
        heure_fin: '10:00',
        jour_semaine: 'lundi',
        type_cours: 'CM'
      });
    }
  }

  close(): void {
    this.modal.close();
  }

  loadDependencies(): void {
    // Salles
    this.apiService.get('/pedagogie/salles').then((res: any) => {
      this.salles = res.data || [];
    });

    // Agents / Enseignants
    this.apiService.get('/agent/liste').then((res: any) => {
      this.enseignants = res.data || res || [];
    }).catch(() => {
      this.enseignants = [];
    });

    // Matières (Ajuster l'URL selon votre API Matières)
    this.apiService.get('/pedagogie/matiere/liste').then((res: any) => {
      this.matieres = res.data || res || [];
    }).catch(() => {
      this.matieres = [];
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
      ? this.apiService.put(`/pedagogie/emplois-du-temps/${this.courseToEdit.id}`, data)
      : this.apiService.post('/pedagogie/emplois-du-temps', data);

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