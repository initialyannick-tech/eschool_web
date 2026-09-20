import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService} from '../../../../core/services/api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Parent} from '../../models/parent';
import {ModalParentComponent} from '../../components/modals/modal-parent/modal-parent.component';
import {ModalParentEleveComponent} from '../../components/modals/modal-parent-eleve/modal-parent-eleve.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomPaginationComponent} from '../../../../shared/components/custom-pagination/custom-pagination.component';
import {ModalShowComponent} from '../../components/modals/modal-show/modal-show.component';

@Component({
  selector: 'app-list-parent',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ReactiveFormsModule, FormsModule, CustomPaginationComponent],
  templateUrl: './list-parent.page.html',
  styleUrls: ['./list-parent.page.scss']
})
export class ListParentPage  {

  apiService = inject(ApiService)
  modal = inject(NgbModal)
  parents: Parent[] = []
  pagination: any[] = []
  isLoad: boolean = true
  searchText: string = ''



  ngOnInit() {
    this.getParents()
  }

  getParents() {
    this.apiService.get('parents').then((data: any) => {
      this.parents = data.data
      this.pagination = data.meta.links
      this.isLoad = false
    })
  }

  add() {
    const modal = this.modal.open(ModalParentEleveComponent, {size: 'xl', backdrop: 'static'})
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getParents()
      }
    })
  }

  edit(classe: any) {
    const modal = this.modal.open(ModalParentComponent, {size: 'lg', backdrop: 'static'})
    modal.componentInstance.classe = classe
    modal.componentInstance.isEdit = true
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getParents()
      }
    })
  }

  showParent(items: Parent) {
     const modal = this.modal.open(ModalShowComponent, {size: 'xl', backdrop: 'static'});
     modal.componentInstance.items = items
  }

  changePage(url: any) {
    if (url != null) {
      this.isLoad = true;
      this.apiService.getPaginate(url).then((data: any) => {
        this.parents = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
  }


  searchAction() {
    if (this.searchText.length >= 3) {
      this.isLoad = true;
      this.apiService.get('parents/search/' + this.searchText).then((data: any) => {
        this.parents = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
    if (this.searchText.length == 0) {
      this.isLoad = true;
      this.getParents()
    }
  }

}
