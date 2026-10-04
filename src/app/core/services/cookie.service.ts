import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CookieService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  setCookie(name: string, value: string | string[] | Record<string, unknown>, days: number) {
    if (isPlatformBrowser(this.platformId)) {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      const date = new Date();
      date.setTime(date.getTime() + (days * 12 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = `${name}=${serializedValue};${expires};path=/`;
    }
  }

  getCookie(name: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length !== 2) {
      return null;
    }

    const rawValue = parts.pop()?.split(';').shift();

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue);
    } catch {
      return rawValue;
    }
  }

  deleteCookie(name: string) {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }


}
