import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../../core/services/api.service';
import {DossierAgent} from '../../models/dossier';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';
import {InfoAgentComponent} from '../../components/tabs/info-agent/info-agent.component';

@Component({
  selector: 'app-detail-agent',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, InfoAgentComponent],
  templateUrl: './detail-agent.page.html',
  styleUrls: ['./detail-agent.page.scss']
})
export class DetailAgentPage {

  route = inject(ActivatedRoute)
  codeAgent = this.route.snapshot.paramMap.get('code')

  apiService = inject(ApiService)
  dossier: DossierAgent = {}
  isLoad: boolean = true
  tabSelected: number = 0

  ngOnInit() {
    this.getAgent()
  }


  getAgent() {
    this.apiService.get('agent/' + this.codeAgent).then((data: any) => {
      this.dossier = data.data
      this.isLoad = false
    })
  }

  changeTab(index: number) {
    this.tabSelected = index
  }

}
