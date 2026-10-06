import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../../core/services/api.service';
import {ShareService} from '../../../../../core/services/share.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {submit} from '@angular/forms/signals';

@Component({
  selector: 'app-modal-parent',
  standalone: true,
  templateUrl: './modal-parent.component.html',
  styleUrls: ['./modal-parent.component.scss']
})
export class ModalParentComponent {

  @Input() parent: any
  @Input() isEdit: boolean = false

  modal = inject(NgbActiveModal)
  apiService = inject(ApiService)
  shareService = inject(ShareService)

  parentForm!: FormGroup
  isSubmit: boolean = false;
  backendErrors: string[] = [];




}
