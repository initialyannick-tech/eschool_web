import { Routes } from '@angular/router';
import { MainLayout } from '../../layout/main-layout/main-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    component: MainLayout,
    children: [
      {
        path: 'users',
        loadComponent: () => import('./views/list-user/list-user.page').then(m => m.ListUserPage)
      },
      {
        path: 'enseignants',
        loadComponent: () => import('./views/list-enseignant/list-enseignant.page').then(m => m.ListEnseignantPage)
      },
      {
        path: 'enseignants/detail/:id',
        loadComponent: () => import('./views/detail-enseignant/detail-enseignant.page').then(m => m.DetailEnseignantPage)
      },
      {
        path: 'roles',
        loadComponent: () => import('./views/list-role/list-role.page').then(m => m.ListRolePage)
      }
    ]
  }
];
