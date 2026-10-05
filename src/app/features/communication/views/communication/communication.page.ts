import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ShareService } from '../../../../core/services/share.service';

@Component({
  selector: 'app-communication-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './communication.page.html',
  styleUrl: './communication.page.scss',
})
export class CommunicationPage implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private shareService = inject(ShareService);

  form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(160)] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(5000)] }),
    audience: new FormControl<'all' | 'role'>('all', { nonNullable: true }),
    role_id: new FormControl<number | null>(null),
    inApp: new FormControl(true, { nonNullable: true }),
    email: new FormControl(false, { nonNullable: true }),
  });

  canManage = false;
  isLoading = true;
  isSending = false;
  roles: any[] = [];
  messages: any[] = [];

  ngOnInit() {
    const permissions = this.authService.getPermissions();
    this.canManage = Array.isArray(permissions) && permissions.includes('annonce.management');
    if (!this.canManage) {
      this.isLoading = false;
      return;
    }
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    Promise.all([
      this.apiService.get('communication/roles'),
      this.apiService.get('communication/messages'),
    ]).then(([rolesResponse, messagesResponse]: any[]) => {
      this.roles = rolesResponse?.data ?? [];
      this.messages = messagesResponse?.data?.data ?? [];
    }).catch(() => {
      this.shareService.toastError('Impossible de charger les données de communication.');
    }).finally(() => {
      this.isLoading = false;
    });
  }

  submit() {
    const roleIsRequired = this.form.controls.audience.value === 'role' && !this.form.controls.role_id.value;
    if (this.form.invalid || roleIsRequired) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const channels = [
      ...(value.inApp ? ['database'] : []),
      ...(value.email ? ['mail'] : []),
    ];

    if (channels.length === 0) {
      this.shareService.toastWarning('Sélectionnez au moins un canal de diffusion.');
      return;
    }

    this.isSending = true;
    this.apiService.post('communication/messages', {
      title: value.title,
      message: value.message,
      audience: value.audience,
      role_id: value.audience === 'role' ? value.role_id : null,
      channels,
    }).then((response: any) => {
      this.shareService.toastSuccess(`Communication envoyée à ${response?.data?.recipient_count ?? 0} utilisateur(s).`);
      this.form.reset({ title: '', message: '', audience: 'all', role_id: null, inApp: true, email: false });
      this.loadData();
    }).catch((error: any) => {
      this.shareService.toastError(error?.error?.message ?? 'La communication n’a pas pu être envoyée.');
    }).finally(() => {
      this.isSending = false;
    });
  }
}