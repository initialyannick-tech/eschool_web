import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService} from '../../../../core/services/api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Classe} from '../../models/classe';
import {ModalClasseComponent} from '../../components/modals/modal-classe/modal-classe.component';
import {CustomPaginationComponent} from '../../../../shared/components/custom-pagination/custom-pagination.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-list-classe',
  standalone: true,
  imports: [CommonModule, CustomPaginationComponent, PageHeaderComponent, FormsModule],
  templateUrl: './list-classe.page.html',
  styleUrls: ['./list-classe.page.scss']
})
export class ListClassePage {

  apiService = inject(ApiService)
  modal = inject(NgbModal)
  classes: Classe[] = []
  pagination: any[] = []
  isLoad: boolean = true
  searchText: string = ''



  ngOnInit() {
    this.getClasses()
  }

  getClasses() {
    this.apiService.get('classe').then((data: any) => {
      this.classes = data.data
      this.pagination = data.meta.links
      this.isLoad = false
    })
  }

  add() {
    const modal = this.modal.open(ModalClasseComponent, {size: 'xl', backdrop: 'static'})
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getClasses()
      }
    })
  }

  edit(classe: any) {
    const modal = this.modal.open(ModalClasseComponent, {size: 'lg', backdrop: 'static'})
    modal.componentInstance.classe = classe
    modal.componentInstance.isEdit = true
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getClasses()
      }
    })
  }

  changePage(url: any) {
    if (url != null) {
      this.isLoad = true;
      this.apiService.getPaginate(url).then((data: any) => {
        this.classes = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
  }


  searchAction() {
    if (this.searchText.length >= 3) {
      this.isLoad = true;
      this.apiService.get('classe/search/' + this.searchText).then((data: any) => {
        this.classes = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
    if (this.searchText.length == 0) {
      this.isLoad = true;
      this.getClasses()
    }
  }
}
