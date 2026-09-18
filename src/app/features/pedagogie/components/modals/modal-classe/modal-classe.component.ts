import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../../core/services/api.service';
import {ShareService} from '../../../../../core/services/share.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgOptionComponent, NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-modal-classe',
  standalone: true,
  templateUrl: './modal-classe.component.html',
  imports: [
    ReactiveFormsModule,
    NgSelectComponent,
    NgOptionComponent
  ],
  styleUrls: ['./modal-classe.component.scss']
})
export class ModalClasseComponent {

  @Input() classe: any
  @Input() isEdit: boolean = false

  modal = inject(NgbActiveModal)
  apiService = inject(ApiService)
  shareService = inject(ShareService)

  classeForm!: FormGroup
  isSubmit: boolean = false;
  annees: any[] = []
  cycles: any[] = []
  professeurs: any[] = []
  series: any[] = []


  ngOnInit() {
    this.getAnnees()
    this.getCycles()
    this.getProfs()
    this.getSeries()
    console.log(this.classe);
    this.classeForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      capacite: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      actif: new FormControl(''),
      annee_scolaire_id: new FormControl('', [Validators.required]),
      cycle_id: new FormControl('', [Validators.required]),
      serie_id: new FormControl(''),
      professeur_principal_id : new FormControl('', [Validators.required]),
    })

    if (this.isEdit) {
      this.classeForm.patchValue({
        nom: this.classe.nom,
        capacite: this.classe.capacite,
        description: this.classe.description,
        actif: this.classe.actif,
        annee_scolaire_id: this.classe.annee_scolaire.id,
        cycle_id: this.classe.cycle.id,
        serie_id: this.classe.serie.id,
        professeur_principal_id: this.classe.professeur_principal.id
      })
    }
  }

  close() {
    this.modal.close()
  }

  submit() {
    if (this.classeForm.valid) {
      this.isSubmit = true
      if (this.isEdit) {
        this.apiService.put('classe/' + this.classe.id, this.classeForm.value).then((data: any) => {
          if (data.success) {
            this.isSubmit = false
            this.shareService.sweetSuccessUpdate()
            this.modal.dismiss('save')
          } else {
            this.isSubmit = false
            this.shareService.sweetAlertError(data.message)
          }
        })
      } else {
        this.apiService.post('classe', this.classeForm.value).then((data: any) => {
          if (data.success) {
            this.isSubmit = false
            this.shareService.sweetSuccessInsert()
            this.modal.dismiss('save')
          } else {
            this.isSubmit = false
            this.shareService.sweetAlertError(data.message)
          }
        })
      }
    } else {
      this.classeForm.markAllAsTouched()
    }
  }

  getAnnees() {
    this.apiService.get('anneeScolaire/liste').then((data: any) => {
      this.annees = data.data
    })
  }

  getCycles() {
    this.apiService.get('cycle/liste').then((data: any) => {
      this.cycles = data.data
    })
  }

  getProfs() {
    this.apiService.get('userList/enseignant').then((data: any) => {
      this.professeurs = data.data
    })
  }

  getSeries() {
    this.apiService.get('serie/liste').then((data: any) => {
      this.series = data.data
    })
  }

}
