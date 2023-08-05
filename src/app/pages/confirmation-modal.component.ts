import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: 'confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  @Input() title: string;
  @Input() message: string;

  constructor(public activeModal: NgbActiveModal) {}

  onConfirmClick(): void {
    this.activeModal.close(true); // Emit true when the user clicks "Yes"
  }

  onCancelClick(): void {
    this.activeModal.close(false); // Emit false when the user clicks "No"
  }
}
