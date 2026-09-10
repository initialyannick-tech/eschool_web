import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Chart} from 'chart.js';
import {ApiService} from '../../../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage  {

  apiService = inject(ApiService);

  // Statistiques

  ngOnInit() {

  }


}
