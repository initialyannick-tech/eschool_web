import { Routes } from '@angular/router';
import { MainLayout } from '../../layout/main-layout/main-layout';

export const COMMUNICATION_ROUTES: Routes = [
  {
    path: 'communication',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./views/communication/communication.page').then(m => m.CommunicationPage)
      }
    ]
  }
];