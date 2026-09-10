import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService} from '../../../../core/services/api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAgentComponent} from '../../components/modal-agent/modal-agent.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';
import {CustomPaginationComponent} from '../../../../shared/components/custom-pagination/custom-pagination.component';
import {Salarie} from '../../models/salarie';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-list-agent',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CustomPaginationComponent, RouterLink],
  templateUrl: './list-agent.page.html',
  styleUrls: ['./list-agent.page.scss']
})
export class ListAgentPage  {

  apiService = inject(ApiService)
  modal = inject(NgbModal)
  salaries: Salarie[] = []
  pagination: any[] = []
  isLoad: boolean = true
  searchText: string = ''


  ngOnInit() {
    this.getAgent()
  }


  add() {
    const modal = this.modal.open(ModalAgentComponent, {size: 'lg', backdrop: 'static'})
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getAgent()
      }
    })
  }

  edit(agent: any) {
    const modal = this.modal.open(ModalAgentComponent, {size: 'lg', backdrop: 'static'})
    modal.componentInstance.agent = agent
    modal.componentInstance.isEdit = true
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getAgent()
      }
    })
  }

  getAgent() {
    this.apiService.get('agent').then((data: any) => {
      this.salaries = data.data
      this.pagination = data.meta.links
      this.isLoad = false
    })
  }


  changePage(url: any) {
    if (url != null) {
      this.isLoad = true;
      this.apiService.getPaginate(url).then((data: any) => {
        this.salaries = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
  }


  searchAction() {
    if (this.searchText.length > 3) {
      this.isLoad = true;
      this.apiService.get('agent/search/' + this.searchText).then((data: any) => {
        this.salaries = data.data;
        this.pagination = data.meta.links;
        this.isLoad = false;
      })
    }
    if (this.searchText.length == 0) {
      this.isLoad = true;
      this.getAgent()
    }
  }
}
