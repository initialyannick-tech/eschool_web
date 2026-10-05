import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {NgxPermissionsService} from 'ngx-permissions';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {ShareService} from './share.service';
import {environment} from '../../../environments/environment';
import {isPlatformServer} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  http = inject(HttpClient)
  router = inject(Router)
  shareService = inject(ShareService)
  permissionsService = inject(NgxPermissionsService)
  platformId = inject(PLATFORM_ID)
  apiUrl = environment.apiUrl

  private shouldSkipServerRequest(): boolean {
    return isPlatformServer(this.platformId);
  }


  /**
   * Get request
   * @url
   */
  get(url: string) {
    if (this.shouldSkipServerRequest()) {
      return Promise.resolve([]);
    }

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
    if (this.shouldSkipServerRequest()) {
      return Promise.resolve({ success: true });
    }

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

  postFormData(url: string, data: FormData) {
    if (this.shouldSkipServerRequest()) {
      return Promise.resolve({ success: true });
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + url, data).subscribe(
        (response: any) => resolve(response),
        (error: any) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          if (error.status === 0) {
            this.shareService.toastWarning('La connexion au serveur a été rompue. Veuillez réessayer plus tard.');
          }
          reject(error);
        }
      );
    });
  }

  getBlob(url: string) {
    if (this.shouldSkipServerRequest()) {
      return Promise.resolve(new Blob());
    }

    return new Promise<Blob>((resolve, reject) => {
      this.http.get(this.apiUrl + url, { responseType: 'blob' }).subscribe(
        (data) => resolve(data),
        (error: any) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          if (error.status === 0) {
            this.shareService.toastWarning('La connexion au serveur a été rompue. Veuillez réessayer plus tard.');
          }
          reject(error);
        }
      );
    });
  }

  /**
   * Put request
   * @url
   * @data
   */
  put(url: string, data: any) {
    if (this.shouldSkipServerRequest()) {
      return Promise.resolve({ success: true });
    }

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

  patch(url: string, data: any = {}) {
    if (this.shouldSkipServerRequest()) {
      return Promise.resolve({ success: true });
    }

    return new Promise((resolve, reject) => {
      this.http.patch(this.apiUrl + url, data).subscribe(
        (data: any) => resolve(data),
        (error: any) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          if (error.status === 0) {
            this.shareService.toastWarning('La connexion au serveur a été rompue. Veuillez réessayer plus tard.');
          }
          reject(error);
        }
      );
    });
  }

  /**
   * Delete request
   * @url
   */
  delete(url: string) {
    if (this.shouldSkipServerRequest()) {
      return Promise.resolve({ success: true });
    }

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
    if (this.shouldSkipServerRequest()) {
      return Promise.resolve({ data: [], total: 0 });
    }

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
    const normalizedPermissions = Array.isArray(permissions)
      ? permissions
      : Array.isArray(permissions?.permissions)
        ? permissions.permissions
        : typeof permissions === 'string'
          ? permissions.split(',').map((permission) => permission.trim()).filter(Boolean)
          : [];

    this.permissionsService.loadPermissions(normalizedPermissions);
  }

}
