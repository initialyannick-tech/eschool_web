import {inject, Injectable} from '@angular/core';
import {NgxPermissionsService} from 'ngx-permissions';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {ShareService} from './share.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  http = inject(HttpClient)
  router = inject(Router)
  shareService = inject(ShareService)
  permissionsService = inject(NgxPermissionsService)
  apiUrl = environment.apiUrl


  /**
   * Get request
   * @url
   */
  get(url: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + url).subscribe(
        (data) => {
          resolve(data)
        },
        (error) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          if (error.status === 0) {
            this.shareService.toastWarning('La connexion au serveur a été rompue. Veuillez réessayer plus tard.')
          }
          reject(error)
        }
      )
    })
  }

  /**
   * Post request
   * @url
   * @data
   */
  post(url: string, data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + url, data).subscribe(
        (data: any) => {
          resolve(data)
        },
        (error: any) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          if (error.status === 0) {
            this.shareService.toastWarning('La connexion au serveur a été rompue. Veuillez réessayer plus tard.')
          }
          reject(error)
        }
      )
    })
  }

  /**
   * Put request
   * @url
   * @data
   */
  put(url: string, data: any) {
    return new Promise((resolve, reject) => {
      this.http.put(this.apiUrl + url, data).subscribe(
        (data: any) => {
          resolve(data)
        },
        (error: any) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          if (error.status === 0) {
            this.shareService.toastWarning('La connexion au serveur a été rompue. Veuillez réessayer plus tard.')
          }
          reject(error)
        }
      )
    })
  }

  /**
   * Delete request
   * @url
   */
  delete(url: string) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.apiUrl + url).subscribe(
        (data: any) => {
          resolve(data)
        },
        (error: any) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          if (error.status === 0) {
            this.shareService.toastWarning('La connexion au serveur a été rompue. Veuillez réessayer plus tard.')
          }
          reject(error)
        }
      )
    })
  }

  /**
   * Get paginate
   * @url
   */
  getPaginate(url: string) {
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (data: any) => {
          resolve(data)
        },
        (error: any) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          if (error.status === 0) {
            this.shareService.toastWarning('La connexion au serveur a été rompue. Veuillez réessayer plus tard.')
          }
          reject(error)
        }
      )
    })
  }

  /**
   * Chargement des permissions
   * @permissions
   */
  loadPermissions(permissions: any) {
    this.permissionsService.loadPermissions(permissions);
  }

}
