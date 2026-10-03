import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../core/services/api.service';
import { ShareService } from '../../../../core/services/share.service';

@Component({
  selector: 'app-modal-enseignant',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-enseignant.component.html',
  styleUrls: ['./modal-enseignant.component.scss']
})
export class ModalEnseignantComponent {
  @Input() enseignant: any;
  @Input() isEdit = false;

  modal = inject(NgbActiveModal);
  apiService = inject(ApiService);
  shareService = inject(ShareService);

  enseignantForm!: FormGroup;
  isSubmit = false;
  matieres: any[] = [];
  selectedMatiereIds: number[] = [];

  ngOnInit() {
    this.enseignantForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role_id: new FormControl('4'),
    });

    if (this.isEdit) {
      this.enseignantForm = new FormGroup({
        nom: new FormControl(this.enseignant?.nom ?? '', [Validators.required]),
        prenom: new FormControl(this.enseignant?.prenom ?? '', [Validators.required]),
        email: new FormControl(this.enseignant?.email ?? '', [Validators.required, Validators.email]),
        role_id: new FormControl(this.enseignant?.role_id ?? '4'),
        status: new FormControl(this.enseignant?.status ?? 'active', [Validators.required]),
      });
    }

    this.loadMatieres();
    if (this.isEdit && this.enseignant?.id) {
      this.loadSelectedMatieres(this.enseignant.id);
    }
  }

  loadMatieres() {
    this.apiService.get('matiere/liste').then((data: any) => {
      this.matieres = data?.data ?? [];
    }).catch(() => {
      this.matieres = [];
    });
  }

  loadSelectedMatieres(enseignantId: number) {
    this.apiService.get(`affectation-enseignant/enseignant/${enseignantId}/matieres`).then((data: any) => {
      this.selectedMatiereIds = (data?.data ?? []).map((matiere: any) => Number(matiere.id));
    }).catch(() => {
      this.selectedMatiereIds = [];
    });
  }

  toggleMatiere(matiereId: number, checked: boolean) {
    if (checked) {
      if (!this.selectedMatiereIds.includes(matiereId)) {
        this.selectedMatiereIds = [...this.selectedMatiereIds, matiereId];
      }
      return;
    }

    this.selectedMatiereIds = this.selectedMatiereIds.filter((id) => id !== matiereId);
  }

  syncMatieres(enseignantId: number) {
    return this.apiService.post(`affectation-enseignant/enseignant/${enseignantId}/matieres`, {
      matiere_ids: this.selectedMatiereIds
    });
  }

  close() {
    this.modal.close();
  }

  submit() {
    if (this.enseignantForm.invalid) {
      this.enseignantForm.markAllAsTouched();
      return;
    }

    this.isSubmit = true;
    const payload = {
      ...this.enseignantForm.getRawValue(),
      role_id: '4'
    };

    const saveTeacher = this.isEdit
      ? this.apiService.put('enseignants/' + this.enseignant.id, payload)
      : this.apiService.post('enseignants', payload);

    saveTeacher.then((data: any) => {
      if (!data?.success) {
        this.isSubmit = false;
        this.shareService.sweetAlertError(data?.message ?? 'Erreur lors de l’enregistrement');
        return;
      }

      const enseignantId = this.isEdit ? this.enseignant.id : data?.data?.id;
      if (!enseignantId) {
        this.isSubmit = false;
        this.shareService.sweetSuccessInsert();
        this.modal.dismiss('save');
        return;
      }

      this.syncMatieres(enseignantId).then((result: any) => {
        this.isSubmit = false;
        if (this.isEdit) {
          this.shareService.sweetSuccessUpdate();
        } else {
          this.shareService.sweetSuccessInsert();
        }
        this.modal.dismiss('save');
      }).catch(() => {
        this.isSubmit = false;
        if (this.isEdit) {
          this.shareService.sweetSuccessUpdate();
        } else {
          this.shareService.sweetSuccessInsert();
        }
        this.modal.dismiss('save');
      });
    }).catch(() => {
      this.isSubmit = false;
    });
  }
}
