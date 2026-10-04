import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import { ShareService } from '../../../../core/services/share.service';
import { Salle } from '../../models/salle';
import { ModalSalleComponent } from '../../components/modals/modal-salle/modal-salle.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomPaginationComponent } from '../../../../shared/components/custom-pagination/custom-pagination.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-salle',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    CustomPaginationComponent
  ],
  templateUrl: './list-salle.page.html',
  styleUrls: ['./list-salle.page.scss']
})
export class ListSallePage implements OnInit {

  apiService = inject(ApiService);
  shareService = inject(ShareService);
  modal = inject(NgbModal);

  salles: Salle[] = [];
  pagination: any[] = [];
  isLoad: boolean = true;
  searchText: string = '';

  ngOnInit(): void {
    this.getSalles();
  }

  getSalles(): void {
    this.apiService.get('pedagogie/salles').then((data: any) => {
      this.salles = data.data;
      this.pagination = data.meta?.links || [];
      this.isLoad = false;
    }).catch(() => {
      this.isLoad = false;
    });
  }

  add(): void {
    const modalRef = this.modal.open(ModalSalleComponent, { size: 'xl', backdrop: 'static' });
    modalRef.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true;
        this.getSalles();
      }
    });
  }

  edit(salle: Salle): void {
    const modalRef = this.modal.open(ModalSalleComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.salle = salle;
    modalRef.componentInstance.isEdit = true;
    modalRef.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true;
        this.getSalles();
      }
    });
  }

  showSalle(items: Salle): void {
    // À adapter selon ton composant modal de visualisation
    // const modalRef = this.modal.open(ModalShowSalleComponent, { size: 'xl', backdrop: 'static' });
    // modalRef.componentInstance.items = items;
  }

  changePage(url: any): void {
    if (url != null) {
      this.isLoad = true;
      this.apiService.getPaginate(url).then((data: any) => {
        this.salles = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      });
    }
  }

  searchAction(): void {
    if (this.searchText.length >= 3) {
      this.isLoad = true;
      this.apiService.get('pedagogie/salles/search/' + this.searchText).then((data: any) => {
        this.salles = data.data;
        this.pagination = data.meta?.links || [];
        this.isLoad = false;
      });
    }
    if (this.searchText.length === 0) {
      this.isLoad = true;
      this.getSalles();
    }
  }

  delete(items: Salle): void {
    if (confirm('Voulez-vous vraiment supprimer cette salle ?')) {
      this.apiService.delete(`pedagogie/salles/${items.id}`)
        .then((res: any) => {
          this.shareService.toastSuccess(res.message || 'Salle supprimée avec succès.');
          this.getSalles();
        })
        .catch((err: any) => {
          this.shareService.toastWarning(err.error?.message || 'Erreur lors de la suppression.');
        });
    }
  }
}