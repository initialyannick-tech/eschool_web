import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService} from '../../../../core/services/api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Eleve} from '../../models/eleve';
import {ModalEleveComponent} from '../../components/modals/modal-eleve/modal-eleve.component';
import {ModalShowEleveComponent} from '../../components/modals/modal-show-eleve/modal-show-eleve.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomPaginationComponent} from '../../../../shared/components/custom-pagination/custom-pagination.component';
import {AssigneParentComponent} from '../../components/modals/assigne-parent/assigne-parent.component';
import {RouterLink} from '@angular/router';



@Component({
  selector: 'app-list-eleve',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ReactiveFormsModule, FormsModule, CustomPaginationComponent, RouterLink],
  templateUrl: './list-eleve.page.html',
  styleUrls: ['./list-eleve.page.scss']
})
export class ListElevePage {


  apiService = inject(ApiService)
  modal = inject(NgbModal)
  eleves: Eleve[] = []
  pagination: any[] = []
  isLoad: boolean = true
  searchText: string = ''



  ngOnInit() {
    this.getEleves()
  }

  getEleves() {
    this.apiService.get('eleves').then((data: any) => {
      this.eleves = data.data
      this.pagination = data.meta.links
      this.isLoad = false
    })
  }

  add() {
    const modal = this.modal.open(ModalEleveComponent, {size: 'xl', backdrop: 'static'})
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getEleves()
      }
    })
  }

  edit(eleve: any) {
    const modal = this.modal.open(ModalEleveComponent, {size: 'xl', backdrop: 'static'})
    modal.componentInstance.eleve = eleve
    modal.componentInstance.isEdit = true
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getEleves()
      }
    })
  }

  showEleve(items: Eleve) {
    const modal = this.modal.open(ModalShowEleveComponent, {size: 'xl', backdrop: 'static'});
    modal.componentInstance.items = items
  }

  changePage(url: any) {
    if (url != null) {
      this.isLoad = true;
      this.apiService.getPaginate(url).then((data: any) => {
        this.eleves = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
  }

  searchAction() {
    if (this.searchText.length >= 3) {
      this.isLoad = true;
      this.apiService.get('eleves/search/' + this.searchText).then((data: any) => {
        this.eleves = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
    if (this.searchText.length == 0) {
      this.isLoad = true;
      this.getEleves()
    }
  }


  protected delete(items: Eleve) {

  }
}
