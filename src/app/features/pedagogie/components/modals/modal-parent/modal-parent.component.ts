import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-modal-parent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-parent.component.html',
  styleUrls: ['./modal-parent.component.scss']
})
export class ModalParentComponent {



}
