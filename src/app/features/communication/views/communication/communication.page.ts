import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';
import {AuthService} from '../../../../core/services/auth.service';
import {CommunicationService} from '../../services/communication.service';

type CommunicationTab = 'announcements' | 'messages' | 'notifications' | 'portal';

@Component({
  selector: 'app-communication',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './communication.page.html',
  styleUrls: ['./communication.page.scss']
})
export class CommunicationPage {
  private readonly communication = inject(CommunicationService);
  private readonly auth = inject(AuthService);

  readonly permissions = new Set<string>(this.auth.getPermissions());
  readonly user = this.auth.getUser() as any;

  activeTab: CommunicationTab = 'announcements';
  announcements: any[] = [];
  notifications: any[] = [];
  conversations: any[] = [];
  contacts: any[] = [];
  roles: any[] = [];
  threadMessages: any[] = [];
  portalData: any = null;
  selectedConversation: any = null;
  unreadCount = 0;
  isLoading = false;
  isSending = false;
  errorMessage = '';
  successMessage = '';

  announcementTitle = '';
  announcementText = '';
  announcementAudience: 'all' | 'role' = 'all';
  announcementRoleId = '';
  emailAnnouncement = false;

  recipientId = '';
  messageText = '';
  attachment: File | null = null;

  get canManageAnnouncements(): boolean {
    return this.hasPermission('annonce.management');
  }

  get canReadAnnouncements(): boolean {
    return this.canManageAnnouncements || this.hasPermission('annonce.consulter');
  }

  get canSendMessages(): boolean {
    return this.hasPermission('message.envoyer');
  }

  get canReadMessages(): boolean {
    return this.hasPermission('message.consulter');
  }

  get isParentOrStudent(): boolean {
    const role = String(this.user?.role?.libelle ?? '').toLocaleLowerCase();
    return role.includes('parent') || role.includes('élève') || role.includes('eleve');
  }

  ngOnInit(): void {
    if (this.canReadAnnouncements) {
      this.loadAnnouncements();
    } else if (this.canReadMessages) {
      this.activeTab = 'messages';
    } else {
      this.activeTab = this.isParentOrStudent ? 'portal' : 'notifications';
    }

    if (this.canReadMessages) {
      this.loadConversations();
    }
    if (this.canSendMessages) {
      this.loadContacts();
    }
    this.loadNotifications();
    if (this.canManageAnnouncements) {
      this.loadRoles();
    }
    if (this.isParentOrStudent) {
      this.loadPortal();
    }
  }

  selectTab(tab: CommunicationTab): void {
    this.activeTab = tab;
    this.clearFeedback();
  }

  async publishAnnouncement(): Promise<void> {
    this.clearFeedback();
    this.isSending = true;
    try {
      const data: Record<string, unknown> = {
        title: this.announcementTitle,
        message: this.announcementText,
        audience: this.announcementAudience,
        channels: this.emailAnnouncement ? ['database', 'mail'] : ['database']
      };
      if (this.announcementAudience === 'role') {
        data['role_id'] = Number(this.announcementRoleId);
      }

      const response = await this.communication.publish(data);
      this.successMessage = response.message ?? 'Annonce publiée.';
      this.announcementTitle = '';
      this.announcementText = '';
      await this.loadAnnouncements();
    } catch (error) {
      this.showError(error);
    } finally {
      this.isSending = false;
    }
  }

  async openConversation(conversation: any): Promise<void> {
    this.clearFeedback();
    this.selectedConversation = conversation;
    try {
      const response = await this.communication.conversationMessages(conversation.id);
      this.threadMessages = response.data;
      conversation.unread_count = 0;
      await this.loadNotifications();
    } catch (error) {
      this.showError(error);
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.selectedConversation && !this.recipientId) {
      this.errorMessage = 'Choisissez un destinataire.';
      return;
    }
    if (!this.messageText.trim() && !this.attachment) {
      this.errorMessage = 'Écrivez un message ou ajoutez une pièce jointe.';
      return;
    }

    this.clearFeedback();
    this.isSending = true;
    const formData = new FormData();
    if (this.messageText.trim()) {
      formData.append('body', this.messageText.trim());
    }
    if (this.attachment) {
      formData.append('attachment', this.attachment);
    }

    try {
      if (this.selectedConversation) {
        await this.communication.reply(this.selectedConversation.id, formData);
        await this.openConversation(this.selectedConversation);
      } else {
        formData.append('recipient_id', this.recipientId);
        const response = await this.communication.startConversation(formData);
        this.successMessage = response.message ?? 'Message envoyé.';
        this.recipientId = '';
        if (this.canReadMessages) {
          await this.loadConversations();
          const conversation = this.conversations.find(item => item.id === response.data.conversation_id);
          if (conversation) {
            await this.openConversation(conversation);
          }
        }
      }
      this.messageText = '';
      this.attachment = null;
    } catch (error) {
      this.showError(error);
    } finally {
      this.isSending = false;
    }
  }

  async archiveConversation(conversation: any): Promise<void> {
    this.clearFeedback();
    try {
      await this.communication.archiveConversation(conversation.id, true);
      this.conversations = this.conversations.filter(item => item.id !== conversation.id);
      if (this.selectedConversation?.id === conversation.id) {
        this.selectedConversation = null;
        this.threadMessages = [];
      }
      this.successMessage = 'Conversation archivée.';
    } catch (error) {
      this.showError(error);
    }
  }

  async markNotificationRead(notification: any): Promise<void> {
    if (notification.read_at) {
      return;
    }
    this.clearFeedback();
    try {
      await this.communication.markNotificationRead(notification.id);
      notification.read_at = new Date().toISOString();
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    } catch (error) {
      this.showError(error);
    }
  }

  async downloadAttachment(message: any): Promise<void> {
    if (!message.attachment_url) {
      return;
    }
    this.clearFeedback();
    try {
      const blob = await this.communication.attachment(message.attachment_url);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = message.attachment_name || 'piece-jointe';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      this.showError(error);
    }
  }

  setAttachment(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.attachment = input.files?.[0] ?? null;
  }

  contactName(contact: any): string {
    return `${contact.prenom} ${contact.nom}${contact.role ? ` · ${contact.role}` : ''}`;
  }

  private async loadAnnouncements(): Promise<void> {
    try {
      const response = await this.communication.messages();
      this.announcements = response.data;
    } catch (error) {
      this.showError(error);
    }
  }

  private async loadNotifications(): Promise<void> {
    try {
      const response = await this.communication.notifications();
      this.notifications = response.data;
      this.unreadCount = response.unread_count ?? 0;
    } catch (error) {
      this.showError(error);
    }
  }

  private async loadConversations(): Promise<void> {
    try {
      const response = await this.communication.conversations();
      this.conversations = response.data;
    } catch (error) {
      this.showError(error);
    }
  }

  private async loadContacts(): Promise<void> {
    try {
      const response = await this.communication.contacts();
      this.contacts = response.data;
    } catch (error) {
      this.showError(error);
    }
  }

  private async loadRoles(): Promise<void> {
    try {
      const response = await this.communication.roles();
      this.roles = response.data;
    } catch (error) {
      this.showError(error);
    }
  }

  private async loadPortal(): Promise<void> {
    try {
      const response = await this.communication.portal();
      this.portalData = response.data;
    } catch (error) {
      this.showError(error);
    }
  }

  private hasPermission(permission: string): boolean {
    return this.permissions.has(permission);
  }

  private clearFeedback(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private showError(error: any): void {
    const validationErrors = error?.error?.errors;
    const firstValidationError = validationErrors
      ? Object.values(validationErrors).flat()[0]
      : null;
    this.errorMessage = String(firstValidationError || error?.error?.message || 'Une erreur est survenue. Réessayez.');
  }
}