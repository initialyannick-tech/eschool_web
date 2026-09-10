import { Routes } from '@angular/router';
import { DASHBOARD_ROUTES } from './features/dashboard/routes';
import { ADMIN_ROUTES } from './features/admin/routes';
import {GuestGuard} from './core/guards/guest.guard';
import {AuthentificationPage} from './features/auth/views/authentification/authentification.page';
import { DEPARTEMENT_ROUTES } from './features/departement/routes';
import { SALARIE_ROUTES } from './features/salarie/routes';


export const routes: Routes = [

    {
      path: '',
      canActivate: [GuestGuard],
      component: AuthentificationPage,
    },
    ...DASHBOARD_ROUTES,
    ...ADMIN_ROUTES,
    ...DEPARTEMENT_ROUTES,
    ...SALARIE_ROUTES,
  {
      path: '**',
      redirectTo: '',
      pathMatch: 'full'
    }

];
