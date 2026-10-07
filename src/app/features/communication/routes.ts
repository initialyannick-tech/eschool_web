import { Routes } from '@angular/router';
import { MainLayout } from '../../layout/main-layout/main-layout';

export const COMMUNICATION_ROUTES: Routes = [
  {
    path: 'notifications',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./views/notifications/notifications.page').then(m => m.NotificationsPage)
      }
    ]
  },
  {
    path: 'communication',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./views/communication/communication.page').then(m => m.CommunicationPage)
      }
    ]
  },
  {
    path: 'messagerie',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./views/messagerie/messagerie.page').then(m => m.MessageriePage)
      }
    ]
  }
];