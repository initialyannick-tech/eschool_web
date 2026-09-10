import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CookieService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  setCookie(name: string, value: string, days: number) {
    if (isPlatformBrowser(this.platformId)) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 12 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
    }
  }

  getCookie(name: string) {
    if (isPlatformBrowser(this.platformId)) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return JSON.parse(parts.pop()?.split(';').shift() || '{}');
      }
    }
    return null;
  }

  deleteCookie(name: string) {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }


}
