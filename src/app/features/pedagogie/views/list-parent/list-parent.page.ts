import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService} from '../../../../core/services/api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Parent} from '../../models/parent';
import {ModalParentComponent} from '../../components/modals/modal-parent/modal-parent.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-list-parent',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './list-parent.page.html',
  styleUrls: ['./list-parent.page.scss']
})
export class ListParentPage {

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
    const modal = this.modal.open(ModalParentComponent, {size: 'xl', backdrop: 'static'})
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getParents()
      }
    })
  }

}
