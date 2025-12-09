import { Component, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-modal',
  template: `
    <div class="modal-header">
      <span>{{ modalHeader }}</span>
      <button class="close" aria-label="Close" (click)="activeModal.dismiss('cross_click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      {{ modalContent }}
    </div>
    <div class="modal-footer">
      <button class="btn btn-sm btn-primary" (click)="activeModal.close('no_click')">No</button>
      <button class="btn btn-sm btn-primary" (click)="activeModal.close('yes_click')">Yes</button>
    </div>
  `,
})
export class ModalComponent {

  modalHeader: string;
  modalContent = ``;
  public onChange: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) { }

}
