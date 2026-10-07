import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import { ShareService } from '../../../../core/services/share.service';
import { CommunicationStateService } from '../../services/communication-state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.page.html',
  styleUrl: './notifications.page.scss',
})
export class NotificationsPage implements OnInit {
  private apiService = inject(ApiService);
  private shareService = inject(ShareService);
  readonly communicationState = inject(CommunicationStateService);

  notifications: any[] = [];
  filter: 'all' | 'unread' = 'all';
  isLoading = true;
  isMarkingAll = false;

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading = true;
    this.apiService.get(`communication/notifications?filter=${this.filter}`).then((response: any) => {
      this.notifications = response?.data?.data ?? [];
    }).catch(() => {
      this.shareService.toastError('Impossible de charger les notifications.');
    }).finally(() => {
      this.isLoading = false;
    });
  }

  setFilter(filter: 'all' | 'unread') {
    this.filter = filter;
    this.loadNotifications();
  }

  markRead(notification: any) {
    if (notification.read_at) {
      return;
    }
    this.apiService.patch(`communication/notifications/${notification.id}/read`).then(() => {
      if (this.filter === 'unread') {
        this.notifications = this.notifications.filter((item) => item.id !== notification.id);
      } else {
        notification.read_at = new Date().toISOString();
      }
      this.communicationState.refreshUnreadCount();
    }).catch(() => {
      this.shareService.toastError('Impossible de marquer cette notification comme lue.');
    });
  }

  markAllRead() {
    this.isMarkingAll = true;
    this.apiService.patch('communication/notifications/read-all').then(() => {
      this.notifications = this.notifications.map((notification) => ({ ...notification, read_at: notification.read_at ?? new Date().toISOString() }));
      this.communicationState.refreshUnreadCount();
      if (this.filter === 'unread') {
        this.loadNotifications();
      }
    }).catch(() => {
      this.shareService.toastError('Impossible de marquer les notifications comme lues.');
    }).finally(() => {
      this.isMarkingAll = false;
    });
  }
}