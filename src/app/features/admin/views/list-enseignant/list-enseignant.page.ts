import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../core/services/api.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ModalEnseignantComponent } from '../../components/modal-enseignant/modal-enseignant.component';
import {CustomPaginationComponent} from '../../../../shared/components/custom-pagination/custom-pagination.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-list-enseignant',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, CustomPaginationComponent, RouterLink],
  templateUrl: './list-enseignant.page.html',
  styleUrls: ['./list-enseignant.page.scss']
})
export class ListEnseignantPage {
  apiService = inject(ApiService);
  modal = inject(NgbModal);

  enseignants: any[] = [];
  isLoad = true;
  searchText = '';
  pagination: any[] = []

  ngOnInit() {
    this.getEnseignants();
  }

  getEnseignants() {
    this.apiService.get('enseignants').then((data: any) => {
      this.enseignants = data.data ?? [];
      this.isLoad = false;
    }).catch(() => {
      this.isLoad = false;
    });
  }

  add() {
    const modal = this.modal.open(ModalEnseignantComponent, { size: 'lg', backdrop: 'static' });
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true;
        this.getEnseignants();
      }
    });
  }

  edit(enseignant: any) {
    const modal = this.modal.open(ModalEnseignantComponent, { size: 'lg', backdrop: 'static' });
    modal.componentInstance.enseignant = enseignant;
    modal.componentInstance.isEdit = true;
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true;
        this.getEnseignants();
      }
    });
  }

  delete(enseignant: any) {
    if (!enseignant?.id) {
      return;
    }
    const confirmed = window.confirm(`Voulez-vous supprimer l'enseignant ${enseignant.nom ?? ''} ${enseignant.prenom ?? ''} ?`);
    if (!confirmed) {
      return;
    }
    this.apiService.delete('enseignants/' + enseignant.id).then((response: any) => {
      if (response?.success) {
        this.getEnseignants();
      }
    });
  }

  searchAction() {
    const criteria = this.searchText.trim().toLowerCase();
    if (!criteria) {
      this.getEnseignants();
      return;
    }
    this.enseignants = this.enseignants.filter((enseignant) => {
      const value = `${enseignant.nom ?? ''} ${enseignant.prenom ?? ''} ${enseignant.email ?? ''} ${enseignant.specialite?.nom ?? ''}`.toLowerCase();
      return value.includes(criteria);
    });
  }

  changePage(url: any) {
    if (url != null) {
      this.isLoad = true;
      this.apiService.getPaginate(url).then((data: any) => {
        this.enseignants = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
  }
}
