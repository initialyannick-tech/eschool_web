import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Metier} from '../../models/metier';
import {ModalMetierComponent} from '../../components/modal-metier/modal-metier.component';
import {CustomPaginationComponent} from '../../../../shared/components/custom-pagination/custom-pagination.component';
import {FormsModule} from '@angular/forms';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-list-metier',
  standalone: true,
  imports: [CommonModule, CustomPaginationComponent, FormsModule, PageHeaderComponent],
  templateUrl: './list-metier.page.html',
  styleUrls: ['./list-metier.page.scss']
})
export class ListMetierPage {

  apiService = inject(ApiService)
  modal = inject(NgbModal)
  metiers: Metier[] = []
  pagination: any[] = []
  isLoad: boolean = true
  searchText: string = ''

  groupedMetiers: any[] = []



  ngOnInit() {
    this.getMetiers()
  }

  groupByService() {

    const services:any = {}


    this.metiers.forEach((metier:any)=>{

      const nomService = metier.services?.libelle ?? 'Sans service'


      if(!services[nomService]){

        services[nomService] = []

      }


      services[nomService].push(metier)

    })


    this.groupedMetiers = Object.keys(services).map(service => ({

      service: service,

      metiers: services[service]

    }))

  }


  add() {
    const modal = this.modal.open(ModalMetierComponent, {size: 'lg', backdrop: 'static'})
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getMetiers()
      }
    })
  }

  edit(metier: any) {
    const modal = this.modal.open(ModalMetierComponent, {size: 'lg', backdrop: 'static'})
    modal.componentInstance.metier = metier
    modal.componentInstance.isEdit = true
    modal.result.catch((reason: any) => {
      if (reason === 'save') {
        this.isLoad = true
        this.getMetiers()
      }
    })
  }

  getMetiers() {
    this.apiService.get('metiers').then((data: any) => {
      this.metiers = data.data
      this.pagination = data.meta.links
      this.groupByService()
      this.isLoad = false
    })
  }


  changePage(url: any) {
    if (url != null) {
      this.isLoad = true;
      this.apiService.getPaginate(url).then((data: any) => {
        this.metiers = data.data;
        this.pagination = data.meta.links;
        this.groupByService()
        this.isLoad = false;
      })
    }
  }


  searchAction() {
    if (this.searchText.length > 3) {
      this.isLoad = true;
      this.apiService.get('metiers/search/' + this.searchText).then((data: any) => {
        this.metiers = data.data;
        this.pagination = data.meta.links;
        this.groupByService()
        this.isLoad = false;
      })
    }
    if (this.searchText.length == 0) {
      this.isLoad = true;
      this.getMetiers()
    }
  }

}
