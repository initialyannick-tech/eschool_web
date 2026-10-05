import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ShareService } from '../../../../core/services/share.service';
import { CommunicationStateService } from '../../services/communication-state.service';

@Component({
  selector: 'app-messagerie-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messagerie.page.html',
  styleUrl: './messagerie.page.scss',
})
export class MessageriePage implements OnInit {
  private apiService = inject(ApiService);
  readonly authService = inject(AuthService);
  private shareService = inject(ShareService);
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private communicationState = inject(CommunicationStateService);

  canRead = false;
  canSend = false;
  isLoading = true;
  isLoadingMessages = false;
  isLoadingRecipients = false;
  isSending = false;
  showArchived = false;
  showComposer = false;
  searchText = '';
  recipientSearch = '';
  subject = '';
  body = '';
  replyBody = '';
  recipientId: number | null = null;
  selectedFile: File | null = null;
  replyFile: File | null = null;
  conversations: any[] = [];
  recipients: any[] = [];
  messages: any[] = [];
  selectedConversation: any = null;
  private pendingConversationId: number | null = null;

  ngOnInit() {
    const conversationParam = Number(this.route.snapshot.queryParamMap.get('conversation'));
    this.pendingConversationId = conversationParam > 0 ? conversationParam : null;
    const permissions = this.authService.getPermissions();
    this.canRead = Array.isArray(permissions) && (
      permissions.includes('message.consulter') || permissions.includes('messagerie.management')
    );
    this.canSend = Array.isArray(permissions) && (
      permissions.includes('message.envoyer') || permissions.includes('messagerie.management')
    );

    if (!this.canRead) {
      this.isLoading = false;
      return;
    }
    this.loadConversations();
  }

  loadConversations() {
    this.isLoading = true;
    const params = new URLSearchParams();
    if (this.searchText.trim()) {
      params.set('search', this.searchText.trim());
    }
    if (this.showArchived) {
      params.set('archived', '1');
    }
    const query = params.size ? `?${params.toString()}` : '';

    this.apiService.get(`communication/conversations${query}`).then((response: any) => {
      this.conversations = response?.data?.data ?? [];
      if (this.pendingConversationId !== null) {
        const target = this.conversations.find((conversation) => conversation.id === this.pendingConversationId);
        if (target) {
          this.pendingConversationId = null;
          this.selectConversation(target);
        }
      }
      if (this.selectedConversation) {
        const updated = this.conversations.find((item) => item.id === this.selectedConversation.id);
        if (updated) {
          this.selectedConversation = updated;
        } else {
          this.selectedConversation = null;
          this.messages = [];
        }
      }
    }).catch(() => {
      this.shareService.toastError('Impossible de charger les conversations.');
    }).finally(() => {
      this.isLoading = false;
    });
  }

  loadRecipients() {
    this.isLoadingRecipients = true;
    const query = this.recipientSearch.trim()
      ? `?search=${encodeURIComponent(this.recipientSearch.trim())}`
      : '';
    this.apiService.get(`communication/recipients${query}`).then((response: any) => {
      this.recipients = response?.data ?? [];
    }).catch(() => {
      this.shareService.toastError('Impossible de charger les destinataires.');
    }).finally(() => {
      this.isLoadingRecipients = false;
    });
  }

  startNewMessage() {
    this.showComposer = true;
    this.selectedConversation = null;
    this.messages = [];
    this.recipientId = null;
    this.subject = '';
    this.body = '';
    this.selectedFile = null;
    this.recipientSearch = '';
    this.loadRecipients();
  }

  selectConversation(conversation: any) {
    this.selectedConversation = conversation;
    this.showComposer = false;
    this.messages = [];
    this.isLoadingMessages = true;
    this.apiService.get(`communication/conversations/${conversation.id}/messages`).then((response: any) => {
      this.messages = (response?.data?.data ?? []).slice().reverse();
      this.selectedConversation = { ...conversation, unread_count: 0 };
      this.communicationState.refreshUnreadCount();
      this.loadConversations();
    }).catch(() => {
      this.shareService.toastError('Impossible de charger cette conversation.');
    }).finally(() => {
      this.isLoadingMessages = false;
    });
  }

  onNewFileSelected(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files?.[0] ?? null;
  }

  onReplyFileSelected(event: Event) {
    this.replyFile = (event.target as HTMLInputElement).files?.[0] ?? null;
  }

  sendNewMessage() {
    if (!this.recipientId || (!this.body.trim() && !this.selectedFile)) {
      this.shareService.toastWarning('Choisissez un destinataire et saisissez un message ou joignez un fichier.');
      return;
    }

    const payload = new FormData();
    payload.append('recipient_id', String(this.recipientId));
    if (this.subject.trim()) {
      payload.append('subject', this.subject.trim());
    }
    if (this.body.trim()) {
      payload.append('body', this.body.trim());
    }
    if (this.selectedFile) {
      payload.append('attachment', this.selectedFile);
    }

    this.isSending = true;
    this.apiService.postFormData('communication/conversations', payload).then((response: any) => {
      const conversation = response?.data?.conversation;
      this.shareService.toastSuccess('Message envoyé.');
      this.showComposer = false;
      this.selectedFile = null;
      this.body = '';
      this.loadConversations();
      if (conversation?.id) {
        this.selectConversation(conversation);
      }
    }).catch((error: any) => {
      this.shareService.toastError(error?.error?.message ?? 'Le message n’a pas pu être envoyé.');
    }).finally(() => {
      this.isSending = false;
    });
  }

  reply() {
    if (!this.selectedConversation || (!this.replyBody.trim() && !this.replyFile)) {
      this.shareService.toastWarning('Saisissez une réponse ou joignez un fichier.');
      return;
    }

    const payload = new FormData();
    if (this.replyBody.trim()) {
      payload.append('body', this.replyBody.trim());
    }
    if (this.replyFile) {
      payload.append('attachment', this.replyFile);
    }

    this.isSending = true;
    this.apiService.postFormData(`communication/conversations/${this.selectedConversation.id}/messages`, payload).then(() => {
      this.replyBody = '';
      this.replyFile = null;
      this.selectConversation(this.selectedConversation);
      this.loadConversations();
    }).catch((error: any) => {
      this.shareService.toastError(error?.error?.message ?? 'La réponse n’a pas pu être envoyée.');
    }).finally(() => {
      this.isSending = false;
    });
  }

  toggleArchive(conversation: any, archived: boolean) {
    this.apiService.patch(`communication/conversations/${conversation.id}/archive`, { archived }).then(() => {
      if (this.selectedConversation?.id === conversation.id) {
        this.selectedConversation = null;
        this.messages = [];
      }
      this.loadConversations();
    }).catch(() => {
      this.shareService.toastError('Impossible de modifier l’archivage de cette conversation.');
    });
  }

  downloadAttachment(message: any) {
    if (!isPlatformBrowser(this.platformId) || !this.selectedConversation || !message.attachment) {
      return;
    }

    this.apiService.getBlob(`communication/conversations/${this.selectedConversation.id}/messages/${message.id}/attachment`).then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = message.attachment.name;
      link.click();
      URL.revokeObjectURL(url);
    }).catch(() => {
      this.shareService.toastError('Impossible de télécharger cette pièce jointe.');
    });
  }

  otherParticipant(conversation: any) {
    return (conversation?.participants ?? []).find((participant: any) => participant.id !== this.authService.getUser()?.id)
      ?? conversation?.participants?.[0];
  }
}