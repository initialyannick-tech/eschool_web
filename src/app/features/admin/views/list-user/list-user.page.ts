import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import {ModalUserComponent} from '../../components/modal-user/modal-user.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomPaginationComponent} from '../../../../shared/components/custom-pagination/custom-pagination.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, CustomPaginationComponent, PageHeaderComponent],
  templateUrl:'./list-user.page.html',
  styleUrls: ['./list-user.page.scss']
})
export class ListUserPage {

  apiService = inject(ApiService)
  modal = inject(NgbModal)
  users: any[] = []
  pagination: any[] = []
  isLoad: boolean = true

  ngOnInit() {
    this.getUsers()
  }


  add() {
    const modal = this.modal.open(ModalUserComponent, {size: 'lg', backdrop: 'static'})
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getUsers()
      }
    })
  }

  edit(edit: any) {
    const modal = this.modal.open(ModalUserComponent, {size: 'lg', backdrop: 'static'})
    modal.componentInstance.user = edit
    modal.componentInstance.isEdit = true
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getUsers()
      }
    })
  }

  getUsers() {
    this.apiService.get('userlist').then((data: any) => {
      this.users = data.data
      this.pagination = data.meta.links
      this.isLoad = false
    })
  }


  changePage(url: any) {
    if (url != null) {
      this.isLoad = true;
      this.apiService.getPaginate(url).then((data: any) => {
        this.users = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
  }



}
