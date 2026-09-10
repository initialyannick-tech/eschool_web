import {Routes} from '@angular/router';
import {MainLayout} from '../../layout/main-layout/main-layout';

export const DEPARTEMENT_ROUTES: Routes = [
  {
    path: 'departement',
    component: MainLayout,
    children: [{
      path: 'list',
      loadComponent: () => import('./views/list-departement/list-departement.page').then(m => m.ListDepartementPage)
    },
      {
        path: 'list-metier',
        loadComponent: () => import('./views/list-metier/list-metier.page').then(m => m.ListMetierPage)
      },
      {
        path: 'list-poste',
        loadComponent: () => import('./views/list-poste/list-poste.page').then(m => m.ListPostePage)
      }

    ]
  }
];
