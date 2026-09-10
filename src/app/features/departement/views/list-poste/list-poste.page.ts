import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Poste} from '../../models/poste';
import {ModalPosteComponent} from '../../components/modal-poste/modal-poste.component';
import {CustomPaginationComponent} from '../../../../shared/components/custom-pagination/custom-pagination.component';
import {FormsModule} from '@angular/forms';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-list-poste',
  standalone: true,
  imports: [CommonModule, CustomPaginationComponent, FormsModule, PageHeaderComponent],
  templateUrl: './list-poste.page.html',
  styleUrls: ['./list-poste.page.scss']
})
export class ListPostePage {
  apiService = inject(ApiService)
  modal = inject(NgbModal)
  postes: Poste[] = []
  pagination: any[] = []
  isLoad: boolean = true
  searchText: string = ''




  ngOnInit() {
    this.getPostes()
  }


  add() {
    const modal = this.modal.open(ModalPosteComponent, {size: 'lg', backdrop: 'static'})
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getPostes()
      }
    })
  }

  edit(poste: any) {
    const modal = this.modal.open(ModalPosteComponent, {size: 'lg', backdrop: 'static'})
    modal.componentInstance.poste = poste
    modal.componentInstance.isEdit = true
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getPostes()
      }
    })
  }

  getPostes() {
    this.apiService.get('poste').then((data: any) => {
      this.postes = data.data
      this.pagination = data.meta.links
      this.isLoad = false
    })
  }


  changePage(url: any) {
    if (url != null) {
      this.isLoad = true;
      this.apiService.getPaginate(url).then((data: any) => {
        this.postes = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
  }


  searchAction() {
    if (this.searchText.length > 3) {
      this.isLoad = true;
      this.apiService.get('poste/search/' + this.searchText).then((data: any) => {
        this.postes = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
    if (this.searchText.length == 0) {
      this.isLoad = true;
      this.getPostes()
    }
  }
}
