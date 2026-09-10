import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService} from '../../../../core/services/api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalRoleComponent} from '../../components/modal-role/modal-role.component';
import {CustomPaginationComponent} from '../../../../shared/components/custom-pagination/custom-pagination.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';


@Component({
  selector: 'app-list-role',
  standalone: true,
  imports: [CommonModule, CustomPaginationComponent, PageHeaderComponent],
  templateUrl: './list-role.page.html',
  styleUrls: ['./list-role.page.scss']
})
export class ListRolePage {

  apiService = inject(ApiService)
  modal = inject(NgbModal)
  roles: any[] = []
  pagination: any[] = []
  isLoad: boolean = true


  ngOnInit() {
    this.getRoles()
  }


  add() {
    const modal = this.modal.open(ModalRoleComponent, {size: 'md', backdrop: 'static'})
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getRoles()
      }
    })
  }

  edit(edit: any) {
    const modal = this.modal.open(ModalRoleComponent, {size: 'md', backdrop: 'static'})
    modal.componentInstance.role = edit
    modal.componentInstance.isEdit = true
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getRoles()
      }
    })
  }

  delete(id: any) {

  }


  getRoles() {
    this.apiService.get('role').then((data: any) => {
      this.roles = data.data
      this.pagination = data.meta.links
      this.isLoad = false
    })
  }


  changePage(url: any) {
    if (url != null) {
      this.isLoad = true;
      this.apiService.getPaginate(url).then((data: any) => {
        this.roles = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
  }


}
