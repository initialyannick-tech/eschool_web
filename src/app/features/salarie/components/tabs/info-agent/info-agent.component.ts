import {Component, inject, input} from '@angular/core';
import {DossierAgent} from '../../../models/dossier';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-agent',
  standalone: true,
  templateUrl: './info-agent.component.html',
  styleUrls: ['./info-agent.component.scss']
})
export class InfoAgentComponent {
  dossier: DossierAgent | any = input.required()
  modal = inject(NgbModal)
  protected readonly parent = parent;

  ngOnInit() {
    console.log(this.dossier())
  }
}
