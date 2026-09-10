
    import { Routes } from '@angular/router';
    import { MainLayout } from '../../layout/main-layout/main-layout';

    export const DASHBOARD_ROUTES: Routes = [
      {
        path: 'dashboard',
        component: MainLayout,
        children: [
          {
            path: '',
            loadComponent: () => import('./views/dashboard/dashboard.page').then(m => m.DashboardPage)
          }
        ]
      },
    ];
