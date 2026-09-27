import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-modal-show-eleve',
  standalone: true,
  templateUrl: './modal-show-eleve.component.html',
  imports: [
    DatePipe
  ],
  styleUrls: ['./modal-show-eleve.component.scss']
})
export class ModalShowEleveComponent {
  @Input() items: any;

  constructor(
    public modal: NgbActiveModal
  ) {}

  close(): void {
    this.modal.dismiss('close');
  }

}
