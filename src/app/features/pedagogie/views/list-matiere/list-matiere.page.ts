import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../core/services/api.service';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';
import {Matiere} from '../../models/matiere';
import {ModalMatiereComponent} from '../../components/modals/modal-matiere/modal-matiere.component';
import {CustomPaginationComponent} from '../../../../shared/components/custom-pagination/custom-pagination.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-matiere',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, CustomPaginationComponent],
  templateUrl: './list-matiere.page.html',
  styleUrls: ['./list-matiere.page.scss']
})
export class ListMatierePage {
  apiService = inject(ApiService);
  modal = inject(NgbModal);

  matieres: Matiere[] = [];
  pagination: any[] = []
  isLoad = true;
  searchText = '';

  ngOnInit() {
    this.getMatieres();
  }

  getMatieres() {
    this.apiService.get('matiere').then((data: any) => {
      this.matieres = data.data
      this.pagination = data.meta.links
      this.isLoad = false
    })
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


  delete(matiere: Matiere): void {
    if (!matiere.id) {
      return;
    }

    Swal.fire({title: 'Supprimer cette matière ?', text: `Voulez-vous vraiment supprimer la matière "${matiere.libelle ?? ''}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.apiService.delete('matiere/' + matiere.id).then((response: any) => {
          if (response?.success) {
            Swal.fire({
              icon: 'success',
              title: 'Matière supprimée',
              text: 'La matière a été supprimée avec succès.',
              confirmButtonText: 'OK',
              confirmButtonColor: '#006b3f',
              timer: 1800,
              timerProgressBar: true
            });
            this.getMatieres();
            return;
          }
          Swal.fire({icon: 'error', title: 'Suppression impossible',
            text: response?.message ?? 'Impossible de supprimer cette matière.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#006b3f'
          });

        })
        .catch((error: any) => {
          Swal.fire({icon: 'error', title: 'Erreur',
            text:
              error?.error?.message ??
              error?.message ??
              'Une erreur est survenue lors de la suppression.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#006b3f'
          });
        });
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

  changePage(url: any) {
    if (url != null) {
      this.isLoad = true;
      this.apiService.getPaginate(url).then((data: any) => {
        this.matieres = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
  }
}
