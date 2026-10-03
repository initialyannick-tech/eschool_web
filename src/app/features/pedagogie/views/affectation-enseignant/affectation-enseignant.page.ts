import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ApiService} from '../../../../core/services/api.service';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-affectation-enseignant',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './affectation-enseignant.page.html',
  styleUrls: ['./affectation-enseignant.page.scss']
})
export class AffectationEnseignantPage {
  apiService = inject(ApiService);

  teachers: any[] = [];
  matieres: any[] = [];
  selectedTeacherId: number | null = null;
  selectedMatiereIds: number[] = [];
  isLoad = true;
  savedMessage = '';

  ngOnInit() {
    this.loadTeachers();
    this.loadMatieres();
  }

  loadTeachers() {
    this.apiService.get('enseignants').then((data: any) => {
      this.teachers = data.data ?? [];
      if (this.teachers.length > 0) {
        this.selectedTeacherId = this.teachers[0].id;
        this.loadTeacherAssignments();
      }
    });
  }

  loadMatieres() {
    this.apiService.get('matiere/liste').then((data: any) => {
      this.matieres = data.data ?? [];
      this.isLoad = false;
    }).catch(() => {
      this.isLoad = false;
    });
  }

  onTeacherChange() {
    this.loadTeacherAssignments();
  }

  loadTeacherAssignments() {
    if (!this.selectedTeacherId) {
      this.selectedMatiereIds = [];
      return;
    }

    this.apiService.get(`affectation-enseignant/enseignant/${this.selectedTeacherId}/matieres`).then((data: any) => {
      this.selectedMatiereIds = (data.data ?? []).map((matiere: any) => Number(matiere.id));
    }).catch(() => {
      this.selectedMatiereIds = [];
    });
  }

  toggleMatiere(matiereId: number, checked: boolean) {
    if (checked) {
      if (!this.selectedMatiereIds.includes(matiereId)) {
        this.selectedMatiereIds.push(matiereId);
      }
      return;
    }

    this.selectedMatiereIds = this.selectedMatiereIds.filter((id) => id !== matiereId);
  }

  saveAffectation() {
    if (!this.selectedTeacherId) {
      return;
    }

    this.apiService.post(`affectation-enseignant/enseignant/${this.selectedTeacherId}/matieres`, {
      matiere_ids: this.selectedMatiereIds
    }).then((response: any) => {
      if (response?.success) {
        this.savedMessage = 'Affectation enregistrée avec succès.';
      }
    }).catch(() => {
      this.savedMessage = 'Une erreur est survenue lors de l\'enregistrement.';
    });
  }
}
