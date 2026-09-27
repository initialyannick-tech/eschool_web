import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../../core/services/api.service';
import {DossierEleve} from '../../models/dossier';
import {InfoEleveComponent} from '../../components/tabs/info-eleve/info-eleve.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-detail-eleve',
  standalone: true,
  imports: [CommonModule, InfoEleveComponent, PageHeaderComponent],
  templateUrl: './detail-eleve.page.html',
  styleUrls: ['./detail-eleve.page.scss']
})
export class DetailElevePage {

  route = inject(ActivatedRoute)
  codeEleve = this.route.snapshot.paramMap.get('code')

  apiService = inject(ApiService)
  dossier: DossierEleve = {}
  isLoad: boolean = true
  tabSelected: number = 0


  ngOnInit() {
    this.getEleve()
  }


  getEleve() {
    this.apiService.get('eleves/' + this.codeEleve).then((data: any) => {
      this.dossier = data.data
      this.isLoad = false
    })
  }

  changeTab(index: number) {
    this.tabSelected = index
  }

}
