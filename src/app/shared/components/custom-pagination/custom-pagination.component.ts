import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';


@Component({
  selector: 'app-custom-pagination',
  standalone: true,
  templateUrl: './custom-pagination.component.html',
  imports: [
    NgClass
  ],
  styleUrls: ['./custom-pagination.component.scss']
})
export class CustomPaginationComponent {

  @Input({required: true}) links: any[] = [];
  @Output() pageChange = new EventEmitter<string>();

  onPageChange(url: string) {
    this.pageChange.emit(url);
  }


}
