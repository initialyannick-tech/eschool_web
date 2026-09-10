import {Routes} from '@angular/router';
import {MainLayout} from '../../layout/main-layout/main-layout';

export const SALARIE_ROUTES: Routes = [
  {
    path: 'agent',
    component: MainLayout,
    children: [
      {
        path: 'list',
        loadComponent: () => import('./views/list-agent/list-agent.page').then(m => m.ListAgentPage)
      },
      {
        path: 'detail/:code',
        loadComponent: () => import('./views/detail-agent/detail-agent.page').then(m => m.DetailAgentPage)
      }
    ]
  }
];
