import {Routes} from '@angular/router';
import {MainLayout} from '../../layout/main-layout/main-layout';

export const PEDAGOGIE_ROUTES: Routes = [
  {
    path: 'pedagogie',
    component: MainLayout,
    children: [{
      path: 'list-classe',
      loadComponent: () => import('./views/list-classe/list-classe.page').then(m => m.ListClassePage)
    },

      {
        path: 'list-parent',
        loadComponent: () => import('./views/list-parent/list-parent.page').then(m => m.ListParentPage)
      },

      {
        path: 'list-eleve',
        loadComponent: () => import('./views/list-eleve/list-eleve.page').then(m => m.ListElevePage)
      },

      {
        path: 'detail/:code',
        loadComponent: () => import('./views/detail-eleve/detail-eleve.page').then(m => m.DetailElevePage)
      },

      {
        path: 'list-matiere',
        loadComponent: () => import('./views/list-matiere/list-matiere.page').then(m => m.ListMatierePage)
      }
    ]
  }
];
