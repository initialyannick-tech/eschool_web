
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
            path: 'roles',
            loadComponent: () => import('./views/list-role/list-role.page').then(m => m.ListRolePage)
          }
        ]
      }
    ];
