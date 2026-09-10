import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService} from '../../../../core/services/api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Departement} from '../../models/departement';
import {ModalDepartementComponent} from '../../components/modal-departement/modal-departement.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';
import {FormsModule} from '@angular/forms';
import {CustomPaginationComponent} from '../../../../shared/components/custom-pagination/custom-pagination.component';

@Component({
  selector: 'app-list-departement',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, FormsModule, CustomPaginationComponent],
  templateUrl: './list-departement.page.html',
  styleUrls: ['./list-departement.page.scss']
})
export class ListDepartementPage{

  apiService = inject(ApiService)
  modal = inject(NgbModal)
  departements: Departement[] = []
  pagination: any[] = []
  isLoad: boolean = true
  searchText: string = ''

  ngOnInit() {
    this.getDepartements()
  }

  add() {
    const modal = this.modal.open(ModalDepartementComponent, {size: 'lg', backdrop: 'static'})
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getDepartements()
      }
    })
  }

  edit(departement: any) {
    const modal = this.modal.open(ModalDepartementComponent, {size: 'lg', backdrop: 'static'})
    modal.componentInstance.departement = departement
    modal.componentInstance.isEdit = true
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getDepartements()
      }
    })
  }

  getDepartements() {
    this.apiService.get('services').then((data: any) => {
      this.departements = data.data
      this.pagination = data.meta.links
      this.isLoad = false
    })
  }


  changePage(url: any) {
    if (url != null) {
      this.isLoad = true;
      this.apiService.getPaginate(url).then((data: any) => {
        this.departements = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
  }


  searchAction() {
    if (this.searchText.length > 3) {
      this.isLoad = true;
      this.apiService.get('services/search/' + this.searchText).then((data: any) => {
        this.departements = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
    if (this.searchText.length == 0) {
      this.isLoad = true;
      this.getDepartements()
    }
  }
}
