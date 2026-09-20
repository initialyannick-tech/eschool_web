import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-modal-show',
  standalone: true,
  templateUrl: './modal-show.component.html',
  imports: [
    DatePipe
  ],
  styleUrls: ['./modal-show.component.scss']
})
export class ModalShowComponent {

  @Input() items: any;

  constructor(
    public modal: NgbActiveModal
  ) {}

  close(): void {
    this.modal.dismiss('close');
  }
}
