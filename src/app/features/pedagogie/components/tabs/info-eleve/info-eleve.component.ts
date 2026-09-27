import {Component, inject, input} from '@angular/core';
import {DossierEleve} from '../../../models/dossier';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-info-eleve',
  standalone: true,
  templateUrl: './info-eleve.component.html',
  imports: [
    DatePipe
  ],
  styleUrls: ['./info-eleve.component.scss']
})
export class InfoEleveComponent {

  dossier: DossierEleve | any = input.required()
  modal = inject(NgbModal)
  protected readonly parent = parent;

  ngOnInit() {
    console.log(this.dossier())
  }
}
