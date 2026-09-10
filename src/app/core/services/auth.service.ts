import {inject, Injectable} from '@angular/core';
import {CookieService} from './cookie.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  cookieService = inject(CookieService)


  /*
  * Function qui permet de récupérer le token de l'utilisateur
  *
  * **/
  getToken(): string | null {
    let sto = this.cookieService.getCookie('token');
    if (sto != null) {
      return sto;
    } else {
      return null;
    }
  }

  /*
  *  Fonction qui permet de vérifier si un utilisateur est connecté
  *
  * **/
  isAuthenticate() {
    let sto = this.cookieService.getCookie('userConnected')
    if (sto != null) {
      return true;
    } else {
      return false;
    }
  }


  /*
  *
  * Fonction qui permet de récupérer l'utilisateur connecté
  * **/
  getUser() {
    let sto = this.cookieService.getCookie('userConnected');
    if (sto != null) {
      return sto;
    } else {
      return false;
    }
  }

  /**
   * Fonction qui permet de vérifier si l'utilisateur a changé son mot de passe
   *
   */
  passwordChanged() {
    let sto = this.cookieService.getCookie('userConnected');
    if (sto != null) {
      return sto.password_changed;
    } else {
      return false;
    }
  }

  /*
    *
    * Fonction qui permet de récupérer les permissions
    * **/
  getPermissions() {
    let sto = this.cookieService.getCookie('permissions');
    if (sto != null) {
      return sto;
    } else {
      return false;
    }
  }


}
