import {Component, inject, input} from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  titre = input.required<string>()
  backBtn = input<boolean>(false)

  location = inject(Location)

  back() {
    this.location.back()
  }

}
