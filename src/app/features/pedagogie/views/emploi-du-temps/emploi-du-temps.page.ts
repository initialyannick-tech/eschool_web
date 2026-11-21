import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShareService } from '../../../../core/services/share.service';
import { EmploiDuTemps } from '../../models/emploi-du-temps';
import { ModalEmploiDuTempsComponent } from '../../components/modals/modal-emploi-du-temps/modal-emploi-du-temps.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

interface ClasseEmploi {
  id: number;
  nom?: string;
  libelle?: string;
  annee_scolaire_id?: number;
}

interface EmploiPdf {
  classe: ClasseEmploi;
  cours: EmploiDuTemps[];
}

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

  classes: ClasseEmploi[] = [];
  selectedClasseId: number | null = null;
  selectedAnneeId: number = 1; // ID de l'année scolaire en cours

  coursList: EmploiDuTemps[] = [];
  isLoad = false;
  isExportingPdf = false;

  jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  heures = Array.from({ length: 16 }, (_, index) => index + 6);

  ngOnInit(): void {
    this.getClasses();
  }

  getClasses(): void {
    this.apiService.get('classe/liste').then((res: any) => {
      this.classes = res.data || res || [];
      if (this.classes.length > 0) {
        this.selectedClasseId = this.classes[0].id;
        this.selectedAnneeId = this.classes[0].annee_scolaire_id || this.selectedAnneeId;
        this.loadEmploiDuTemps();
      }
    });
  }

  onClasseChange(): void {
    const classe = this.classes.find(item => item.id === Number(this.selectedClasseId));
    if (classe?.annee_scolaire_id) {
      this.selectedAnneeId = classe.annee_scolaire_id;
    }
    this.loadEmploiDuTemps();
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

  getCoursPourHeure(jour: string, heure: number): EmploiDuTemps | undefined {
    const debutCreneau = heure * 60;
    const finCreneau = (heure + 1) * 60;

    return this.getCoursForJour(jour).find(cours =>
      this.minutes(cours.heure_debut) < finCreneau &&
      this.minutes(cours.heure_fin) > debutCreneau
    );
  }

  isContinuation(cours: EmploiDuTemps, heure: number): boolean {
    return Math.max(6, Math.floor(this.minutes(cours.heure_debut) / 60)) < heure;
  }

  getCourseRowSpan(cours: EmploiDuTemps): number {
    const debut = Math.max(6, Math.floor(this.minutes(cours.heure_debut) / 60));
    const fin = Math.min(22, Math.ceil(this.minutes(cours.heure_fin) / 60));
    return Math.max(1, fin - debut);
  }

  getCoursHorsPlage(): EmploiDuTemps[] {
    return this.coursList.filter(cours =>
      this.minutes(cours.heure_debut) < 6 * 60 ||
      this.minutes(cours.heure_fin) > 22 * 60
    );
  }

  formatHeure(value: string): string {
    return value.slice(0, 5);
  }

  private minutes(value: string): number {
    const [heures, minutes] = value.split(':').map(Number);
    return heures * 60 + minutes;
  }

  async downloadClassePdf(): Promise<void> {
    const classe = this.classes.find(item => item.id === Number(this.selectedClasseId));
    if (!classe || this.isLoad || this.isExportingPdf) {
      return;
    }

    this.isExportingPdf = true;
    try {
      const classFileName = this.fileName(classe.nom || classe.libelle || 'classe');
      await this.createPdf(
        [{ classe, cours: this.coursList }],
        `emploi-du-temps-${classFileName}`
      );
    } catch {
      this.shareService.toastWarning('Impossible de générer le PDF de cette classe.');
    } finally {
      this.isExportingPdf = false;
    }
  }

  async downloadToutesClassesPdf(): Promise<void> {
    if (this.classes.length === 0 || this.isExportingPdf) {
      return;
    }

    this.isExportingPdf = true;
    try {
      const classes = this.classes.filter(
        classe => classe.annee_scolaire_id === this.selectedAnneeId
      );
      if (classes.length === 0) {
        this.shareService.toastWarning('Aucune classe disponible pour cette année scolaire.');
        return;
      }
      const emplois = await Promise.all(
        classes.map(async classe => {
          const response: any = await this.apiService.get(
            `emplois-du-temps/classe/${classe.id}?annee_scolaire_id=${this.selectedAnneeId}`
          );
          return { classe, cours: response.data || [] };
        })
      );

      await this.createPdf(emplois, 'emplois-du-temps-toutes-les-classes');
    } catch (error: any) {
      this.shareService.toastWarning(
        error?.error?.message || 'Impossible de récupérer les emplois du temps de toutes les classes.'
      );
    } finally {
      this.isExportingPdf = false;
    }
  }

  private async createPdf(emplois: EmploiPdf[], fileName: string): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const margin = 8;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const timeColumnWidth = 30;
    const dayColumnWidth = (pageWidth - (margin * 2) - timeColumnWidth) / this.jours.length;
    const titleY = 7;
    const titleHeight = 19;
    const tableTop = 30;
    const headerHeight = 10;
    const rowHeight = 9.9;
    let firstClass = true;

    for (const emploi of emplois) {
      if (!firstClass) {
        pdf.addPage();
      }
      firstClass = false;

      const className = emploi.classe.nom || emploi.classe.libelle || `Classe ${emploi.classe.id}`;
      pdf.setFillColor(7, 37, 68);
      pdf.roundedRect(margin, titleY, pageWidth - margin * 2, titleHeight, 3, 3, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('Emploi du Temps', pageWidth / 2, titleY + 8, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(className, pageWidth / 2, titleY + 15, { align: 'center' });

      const drawCell = (
        x: number,
        y: number,
        width: number,
        height: number,
        fill: [number, number, number]
      ): void => {
        pdf.setFillColor(...fill);
        pdf.setDrawColor(51, 61, 72);
        pdf.rect(x, y, width, height, 'FD');
      };

      drawCell(margin, tableTop, timeColumnWidth, headerHeight, [10, 58, 111]);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.text('Heure', margin + timeColumnWidth / 2, tableTop + 6.5, { align: 'center' });

      this.jours.forEach((jour, index) => {
        const x = margin + timeColumnWidth + index * dayColumnWidth;
        drawCell(x, tableTop, dayColumnWidth, headerHeight, [10, 58, 111]);
        const label = jour.charAt(0).toUpperCase() + jour.slice(1);
        pdf.text(label, x + dayColumnWidth / 2, tableTop + 6.5, { align: 'center' });
      });

      this.heures.forEach((heure, rowIndex) => {
        const y = tableTop + headerHeight + rowIndex * rowHeight;
        drawCell(margin, y, timeColumnWidth, rowHeight, [226, 235, 250]);
        pdf.setTextColor(20, 32, 48);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.5);
        pdf.text(`${heure}h - ${heure + 1}h`, margin + timeColumnWidth / 2, y + 6.3, { align: 'center' });

        this.jours.forEach((jour, dayIndex) => {
          const x = margin + timeColumnWidth + dayIndex * dayColumnWidth;
          const cours = emploi.cours.find(item =>
            item.jour_semaine.toLowerCase() === jour &&
            this.minutes(item.heure_debut) < (heure + 1) * 60 &&
            this.minutes(item.heure_fin) > heure * 60
          );
          if (cours && this.isContinuation(cours, heure)) {
            return;
          }

          if (!cours) {
            drawCell(x, y, dayColumnWidth, rowHeight, [255, 255, 255]);
            return;
          }

          const span = Math.min(this.getCourseRowSpan(cours), this.heures.length - rowIndex);
          const cellHeight = span * rowHeight;
          drawCell(x, y, dayColumnWidth, cellHeight, [226, 237, 254]);
          pdf.setTextColor(16, 43, 76);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(5.5);

          const teacher = `${cours.enseignant?.nom || ''} ${cours.enseignant?.prenom || ''}`.trim();
          const room = cours.salle?.code || cours.salle?.nom || 'Salle non renseignée';
          const details = [
            `${this.formatHeure(cours.heure_debut)}-${this.formatHeure(cours.heure_fin)} ${cours.type_cours || ''}`.trim(),
            cours.matiere?.libelle || cours.matiere?.nom || 'Matière non renseignée',
            teacher || 'Enseignant non renseigné',
            room
          ].flatMap(value => pdf.splitTextToSize(String(value), dayColumnWidth - 3).slice(0, 2));
          const lineHeight = Math.min(2.7, (cellHeight - 2) / details.length);
          details.forEach((line, index) => {
            pdf.text(line, x + 1.5, y + 2 + lineHeight * (index + 1));
          });
        });
      });

      const horsPlage = emploi.cours.filter(cours =>
        this.minutes(cours.heure_debut) < 6 * 60 || this.minutes(cours.heure_fin) > 22 * 60
      );
      if (horsPlage.length > 0) {
        pdf.addPage();
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(16, 43, 76);
        pdf.setFontSize(14);
        pdf.text(`Cours hors grille - ${className}`, margin, 18);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        horsPlage.forEach((cours, index) => {
          const jour = cours.jour_semaine.charAt(0).toUpperCase() + cours.jour_semaine.slice(1);
          const matiere = cours.matiere?.libelle || cours.matiere?.nom || 'Matière non renseignée';
          pdf.text(
            `${jour} ${this.formatHeure(cours.heure_debut)}-${this.formatHeure(cours.heure_fin)} : ${matiere}`,
            margin,
            28 + index * 7
          );
        });
      }
    }

    pdf.save(`${fileName}.pdf`);
  }

  private fileName(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'classe';
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
    Swal.fire({
      title: 'Suppression de cours',
      text: 'Voulez-vous vraiment supprimer ce créneau de cours ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.apiService.delete(`emplois-du-temps/${id}`)
        .then((res: any) => {
          this.shareService.toastSuccess(res.message || 'Cours supprimé avec succès.');
          this.loadEmploiDuTemps();
        })
        .catch((err: any) => {
          this.shareService.toastWarning(
            err.error?.message || 'Erreur lors de la suppression.'
          );
        });
    });
  }
}