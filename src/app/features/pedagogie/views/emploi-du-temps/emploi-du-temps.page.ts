import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShareService } from '../../../../core/services/share.service';
import { EmploiDuTemps } from '../../models/emploi-du-temps';
import { ModalEmploiDuTempsComponent } from '../../components/modals/modal-emploi-du-temps/modal-emploi-du-temps.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-emploi-du-temps',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent
  ],
  templateUrl: './emploi-du-temps.page.html',
  styleUrls: ['./emploi-du-temps.page.scss']
})
export class EmploiDuTempsPage implements OnInit {
  private apiService = inject(ApiService);
  private shareService = inject(ShareService);
  private modal = inject(NgbModal);

  classes: any[] = [];
  selectedClasseId: number | null = null;
  selectedAnneeId: number = 1; // ID de l'année scolaire en cours

  coursList: EmploiDuTemps[] = [];
  isLoad = false;

  jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  ngOnInit(): void {
    this.getClasses();
  }

  getClasses(): void {
    this.apiService.get('classe/liste').then((res: any) => {
      this.classes = res.data || res || [];
      if (this.classes.length > 0) {
        this.selectedClasseId = this.classes[0].id;
        this.loadEmploiDuTemps();
      }
    });
  }

  loadEmploiDuTemps(): void {
    if (!this.selectedClasseId) return;

    this.isLoad = true;
    this.apiService.get(
      `emplois-du-temps/classe/${this.selectedClasseId}?annee_scolaire_id=${this.selectedAnneeId}`
    )
      .then((res: any) => {
        this.coursList = res.data || [];
        this.isLoad = false;
      })
      .catch(() => {
        this.coursList = [];
        this.isLoad = false;
      });
  }

  getCoursForJour(jour: string): EmploiDuTemps[] {
    return this.coursList.filter(
      c => c.jour_semaine?.toLowerCase() === jour.toLowerCase()
    );
  }

  openModal(cours: EmploiDuTemps | null = null): void {
    const modalRef = this.modal.open(ModalEmploiDuTempsComponent, {
      size: 'xl',
      backdrop: 'static'
    });
    modalRef.componentInstance.initialize(
      this.selectedClasseId,
      this.selectedAnneeId,
      cours
    );
    modalRef.result.catch((reason: unknown) => {
      if (reason === 'save') {
        this.loadEmploiDuTemps();
      }
    });
  }

  deleteCours(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce créneau de cours ?')) {
      this.apiService.delete(`emplois-du-temps/${id}`)
        .then((res: any) => {
          this.shareService.toastSuccess(res.message || 'Cours supprimé.');
          this.loadEmploiDuTemps();
        })
        .catch((err: any) => {
          this.shareService.toastWarning(
            err.error?.message || 'Erreur lors de la suppression.'
          );
        });
    }
  }
}