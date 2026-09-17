import {Routes} from '@angular/router';
import {MainLayout} from '../../layout/main-layout/main-layout';

export const PEDAGOGIE_ROUTES: Routes = [
  {
    path: 'pedagogie',
    component: MainLayout,
    children: [
      {
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
      }


    ]
  }
];
