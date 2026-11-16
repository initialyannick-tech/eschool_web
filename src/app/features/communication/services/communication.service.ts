import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../../core/services/api.service';

export interface CommunicationEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  unread_count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private readonly api = inject(ApiService);
  private readonly baseUrl = 'communication';

  messages() {
    return this.api.get(`${this.baseUrl}/messages`) as Promise<CommunicationEnvelope<any[]>>;
  }

  notifications() {
    return this.api.get(`${this.baseUrl}/notifications`) as Promise<CommunicationEnvelope<any[]>>;
  }

  contacts() {
    return this.api.get(`${this.baseUrl}/contacts`) as Promise<CommunicationEnvelope<any[]>>;
  }

  roles() {
    return this.api.get(`${this.baseUrl}/roles`) as Promise<CommunicationEnvelope<any[]>>;
  }

  conversations() {
    return this.api.get(`${this.baseUrl}/conversations`) as Promise<CommunicationEnvelope<any[]>>;
  }

  conversationMessages(id: number) {
    return this.api.get(`${this.baseUrl}/conversations/${id}/messages`) as Promise<CommunicationEnvelope<any[]>>;
  }

  portal() {
    return this.api.get(`${this.baseUrl}/portal`) as Promise<CommunicationEnvelope<any>>;
  }

  publish(data: Record<string, unknown>) {
    return this.api.post(`${this.baseUrl}/messages`, data) as Promise<CommunicationEnvelope<any>>;
  }

  startConversation(data: FormData) {
    return this.api.postFormData(`${this.baseUrl}/conversations`, data) as Promise<CommunicationEnvelope<any>>;
  }

  reply(id: number, data: FormData) {
    return this.api.postFormData(`${this.baseUrl}/conversations/${id}/messages`, data) as Promise<CommunicationEnvelope<any>>;
  }

  markNotificationRead(id: string) {
    return this.api.patch(`${this.baseUrl}/notifications/${id}/read`) as Promise<CommunicationEnvelope<null>>;
  }

  archiveConversation(id: number, archived: boolean) {
    return this.api.patch(`${this.baseUrl}/conversations/${id}/archive`, { archived }) as Promise<CommunicationEnvelope<null>>;
  }

  attachment(url: string) {
    return this.api.getBlob(url.replace(/^.*\/api\//, ''));
  }
}
