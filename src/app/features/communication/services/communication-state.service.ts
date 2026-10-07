import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class CommunicationStateService {
  private apiService = inject(ApiService);
  unreadCount = signal<number>(0);

  refreshUnreadCount() {
    this.apiService.get('communication/notifications?filter=unread').then((response: any) => {
      this.unreadCount.set(response?.data?.meta?.total ?? 0);
    }).catch(() => {
      this.unreadCount.set(0);
    });
  }
}