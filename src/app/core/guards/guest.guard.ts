import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {inject, Injectable} from "@angular/core";
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  authService = inject(AuthService)
  route = inject(Router)

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    let isLoggedIn = this.authService.isAuthenticate();
    if (!isLoggedIn) {
      return true;
    } else {
      this.route.navigate(['/dashboard']);
    }
  }
}
