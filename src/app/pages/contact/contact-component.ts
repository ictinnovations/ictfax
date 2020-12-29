import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ContactService } from './contact.service';
import { MatPaginator, MatSort } from '@angular/material';
import { ContactDatabase } from './contact-database.component';
import { ContactDataSource } from './contact-datasource.component';
import { ModalComponent } from '../../modal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'ngx-contact-component',
  templateUrl: './contact-component.html',
  styleUrls: ['./contact-component.scss'],
})


export class FormsContactComponent implements OnInit {
  constructor(private contact_service: ContactService, private modalService: NgbModal) { }

  aContact: ContactDataSource | null;
  length: number;
  closeResult: any;

  displayedColumns= ['ID', 'firstName', 'lastName', 'Phone', 'Email', 'Operations'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild('filter', {static: false}) filter: ElementRef;

  ngOnInit() {
    this.getContactlist();
  }

  getContactlist() {
    this.contact_service.get_ContactList().then(data => {
      this.length = data.length;
      this.aContact = new ContactDataSource(new ContactDatabase( data ), this.sort, this.paginator);

      // Observable for the filter
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
     .debounceTime(150)
     .distinctUntilChanged()
     .subscribe(() => {
       if (!this.aContact) { return; }
       this.aContact.filter = this.filter.nativeElement.value;
      });
    });
  }

  deleteContact(contact_id): void {
    this.contact_service.delete_Contact(contact_id)
    .then(response => {
    })
    .catch(this.handleError);
    this.getContactlist();
  }

  // Modal related
  showStaticModal(name, contact_id) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      container: 'nb-layout',
    });

    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = `Are you sure you want to delete ${name}?`;
    activeModal.result.then((result) => {
      this.closeResult = result;
      if (this.closeResult === 'yes_click') {
        this.deleteContact(contact_id);
      }
    }, (reason) => {
      this.closeResult = this.getDismissReason(reason);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
