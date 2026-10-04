import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../../../core/services/api.service';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-detail-enseignant',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './detail-enseignant.page.html',
  styleUrls: ['./detail-enseignant.page.scss']
})
export class DetailEnseignantPage {

  route = inject(ActivatedRoute)
  router = inject(Router)
  apiService = inject(ApiService)

  enseignantId = this.route.snapshot.paramMap.get('id')
  enseignant: any = {}
  matieres: any[] = []
  isLoad: boolean = true

  ngOnInit() {
    this.getEnseignant()
  }

  getEnseignant() {
    if (!this.enseignantId) {
      this.isLoad = false
      return
    }

    this.apiService.get('enseignants/' + this.enseignantId).then((data: any) => {
      this.enseignant = data.data ?? {}
      this.getMatieres()
    }).catch(() => {
      this.isLoad = false
    })
  }

  getMatieres() {
    if (!this.enseignantId) {
      this.isLoad = false
      return
    }

    this.apiService.get('affectation-enseignant/enseignant/' + this.enseignantId + '/matieres').then((data: any) => {
      this.matieres = data.data ?? []
      this.isLoad = false
    }).catch(() => {
      this.matieres = []
      this.isLoad = false
    })
  }

  goBack() {
    this.router.navigate(['/admin/enseignants'])
  }

}
