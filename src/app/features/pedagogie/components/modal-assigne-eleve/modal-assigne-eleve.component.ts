import {Component, inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../core/services/api.service';
import {ShareService} from '../../../../core/services/share.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-modal-assigne-eleve',
  standalone: true,
  templateUrl: './modal-assigne-eleve.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  styleUrls: ['./modal-assigne-eleve.component.scss']
})
export class ModalAssigneEleveComponent implements OnInit {

  @Input() parent: any;

  modal = inject(NgbActiveModal);
  apiService = inject(ApiService);
  shareService = inject(ShareService);

  isSubmit = false;
  isLoad = true;

  eleves: any[] = [];
  elevesFiltres: any[] = [];
  searchTerm = '';
  backendErrors: any = {};

  assignationForm!: FormGroup;

  ngOnInit() {
    this.assignationForm = new FormGroup({
      eleve_id: new FormControl('', [Validators.required]),
      parent_id: new FormControl(this.parent?.id, [Validators.required]),
      relation: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      responsable_principal: new FormControl(false),
      responsable_financier: new FormControl(false)
    });

    this.getEleves();
  }

  close() {
    this.modal.close();
  }

  getEleves() {
    this.isLoad = true;

    this.apiService.get('eleves/liste').then((data: any) => {
      this.eleves = data.data || [];
      this.elevesFiltres = [...this.eleves];
      this.isLoad = false;
    }).catch((error: any) => {
      console.error('Erreur lors du chargement des élèves', error);
      this.isLoad = false;
    });
  }

  rechercherEleve() {
    const terme = this.searchTerm.trim().toLowerCase();

    if (!terme) {
      this.elevesFiltres = [...this.eleves];
      return;
    }

    this.elevesFiltres = this.eleves.filter((eleve: any) => {
      const nomComplet =
        `${eleve.nom || ''} ${eleve.prenom || ''}`.toLowerCase();

      const matricule = String(eleve.matricule || '').toLowerCase();

      return nomComplet.includes(terme) ||
        matricule.includes(terme);
    });
  }

  submit() {
    if (this.assignationForm.valid) {
      this.isSubmit = true;
      this.backendErrors = {};

      this.apiService.post(
        'parent/assigner-eleve',
        this.assignationForm.value
      ).then((data: any) => {
        this.modal.dismiss('save');

        this.shareService.sweetAlertSuccess(
          'Élève assigné au parent avec succès'
        );

        this.isSubmit = false;
      }).catch((error: any) => {
        this.backendErrors = error?.error?.errors || {};
        this.isSubmit = false;
      });
    } else {
      this.assignationForm.markAllAsTouched();
    }
  }
}
