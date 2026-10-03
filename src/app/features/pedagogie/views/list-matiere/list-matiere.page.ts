import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../core/services/api.service';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';
import {Matiere} from '../../models/matiere';
import {ModalMatiereComponent} from '../../components/modals/modal-matiere/modal-matiere.component';

@Component({
  selector: 'app-list-matiere',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './list-matiere.page.html',
  styleUrls: ['./list-matiere.page.scss']
})
export class ListMatierePage {
  apiService = inject(ApiService);
  modal = inject(NgbModal);

  matieres: Matiere[] = [];
  isLoad = true;
  searchText = '';

  ngOnInit() {
    this.getMatieres();
  }

  getMatieres() {
    this.apiService.get('matiere').then((data: any) => {
      this.matieres = data.data ?? [];
      this.isLoad = false;
    }).catch(() => {
      this.isLoad = false;
    });
  }

  add() {
    const modal = this.modal.open(ModalMatiereComponent, {size: 'lg', backdrop: 'static'});
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true;
        this.getMatieres();
      }
    });
  }

  edit(matiere: Matiere) {
    const modal = this.modal.open(ModalMatiereComponent, {size: 'lg', backdrop: 'static'});
    modal.componentInstance.matiere = matiere;
    modal.componentInstance.isEdit = true;
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true;
        this.getMatieres();
      }
    });
  }

  delete(matiere: Matiere) {
    if (!matiere.id) {
      return;
    }

    const confirmed = window.confirm(`Voulez-vous supprimer la matière ${matiere.libelle ?? ''} ?`);
    if (!confirmed) {
      return;
    }

    this.apiService.delete('matiere/' + matiere.id).then((response: any) => {
      if (response?.success) {
        this.getMatieres();
      }
    });
  }

  searchAction() {
    const criteria = this.searchText.trim().toLowerCase();
    if (!criteria) {
      this.getMatieres();
      return;
    }

    this.matieres = this.matieres.filter((matiere) => {
      const value = `${matiere.libelle ?? ''} ${matiere.code ?? ''} ${matiere.description ?? ''}`.toLowerCase();
      return value.includes(criteria);
    });
  }
}
