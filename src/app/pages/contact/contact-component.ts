import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ContactService } from './contact.service';
import { MatPaginator,} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ContactDatabase } from './contact-database.component';
import { ContactDataSource } from './contact-datasource.component';
import { ModalComponent } from '../../modal.component';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { SendFax,DocumentProgram } from '../sendfax/sendfax';
import { CompleterData, CompleterItem, CompleterService } from 'ng2-completer';
import { SendFaxService } from '../sendfax/sendfax.service';
import { DocumentService } from '../message/document/document.service';
import { Document } from '../message/document/document';
import { Contact } from './contact';
import { DID } from '../did/did';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';


@Component({
  selector: 'ngx-contact-component',
  templateUrl: './contact-component.html',
  styleUrls: ['./contact-component.scss'],
})


export class FormsContactComponent implements OnInit {
  constructor(private contact_service: ContactService,
     private dataSourceBuilder: NbTreeGridDataSourceBuilder<Contact>,
     private modalService: NgbModal,
     private sendfax_service :SendFaxService,
     private document_service :DocumentService,
     private completerService : CompleterService,
    ) { }

  aContact: Contact[];
  ContactDataSource: NbTreeGridDataSource<Contact>;
  contact: any;
  length: number;
  closeResult: any;
  contactArray: Contact[] =[]
  accountArray :DID[]=[]
  trans_id:any;
  documentProgram: DocumentProgram = new DocumentProgram;
  private modalRef: NgbModalRef;
  documentArray: Document[] = [];
  document: Document = new Document;
  dataService: CompleterData;
  phone: number;


  displayedColumns= ['ID', 'firstName', 'lastName', 'Phone', 'Email', 'Operations'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild('filter', {static: false}) filter: ElementRef;

  sendfax: SendFax = new SendFax;


  ngOnInit() {
    this.getContactlist();
    this.getDocumentlist();
    this.getdestination();
    this.getAccountList()
  }

  getContactlist() {
    this.contact_service.get_ContactList().then(data => {
      this.aContact = data;
      this.length = data.length;

      this.ContactDataSource = this.dataSourceBuilder.create(this.aContact.map(item => ({ data: item })),);

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

  onSelectContact(value) {
    if (value != 0) {
      this.sendfax.contact_id = value;
    }
    else {
      this.sendfax.contact_id = undefined;
    }
  }

  deleteContact(contact_id): void {
    this.contact_service.delete_Contact(contact_id)
    .then(response => {
    })
    .catch(this.handleError);
    this.getContactlist();
  }

  // Modal related
  showStaticModal(contact_id) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      container: 'nb-layout',
    });

    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = `Are you sure you want to delete ${contact_id}?`;
    activeModal.result.then((result) => {
      this.closeResult = result;
      if (this.closeResult === 'yes_click') {
        this.deleteContact(contact_id);
      }
    }, (reason) => {
      this.closeResult = this.getDismissReason(reason);
    });
  }

  open(content, contact_id) {
    this.contact_service.get_ContactData(contact_id).then((contact) => {
      this.documentProgram.document_id = contact_id;
      this.sendfax.phone=contact.phone
      this.modalRef = this.modalService.open(content, { size: 'md' });

      this.modalRef.result.then((result) => {
        // Handle modal close result
      }, (reason) => {
        // Handle modal dismissal reason
      });
    });
  }

  getdestination(){
    this.contact_service.get_ContactList().then(data => {
      this.contactArray = data;
      this.dataService = this.completerService.local(this.contactArray,'phone', 'phone');
    })
    }

  onSelected(item: CompleterItem) {
    if (item != null) {
      this.sendfax.contact_id = item.originalObject.contact_id;
    }
    else {
      this.sendfax.contact_id = undefined;
    }
  }
  closeModal() {
    this.modalRef.close();
  }

  addSendDocument(): void {
    if (this.sendfax.contact_id != undefined) {
        this.sendfax.phone = undefined;
    }
    this.sendfax_service.add_senddocument(this.documentProgram).then(response => {
      const program_id = response;
      this.sendfax.program_id = program_id;
      this.AddTransmission();
      this.closeModal();
    });
  }

  AddTransmission(): void {
    this.sendfax_service.add_SendFax(this.sendfax).then(response => {
      const transmission_id = response;
      this.trans_id = transmission_id;
      this.AddSend(this.trans_id);
    });
  }

  AddSend(trans_id): void {
    this.sendfax_service.send_transmission(this.trans_id).then(response => {
    });
  }

  getDocumentlist() {
    this.document_service.get_DocumentList().then(data => {
      this.documentArray = data;
      if (data) this.documentProgram.document_id = this.documentArray[this.documentArray.length -1].document_id;
    });
  }

  onSelect(value) {
    if (value != 0) {
      this.documentProgram.document_id = value;
    }
    else {
      this.documentProgram.document_id = undefined;
    }
    console.log(this.documentProgram.document_id);
  }

  getAccountList(){
    this.sendfax_service.get_AccountList().then(data => {
      this.accountArray =data;
      this.sendfax.account_id = this.accountArray[this.accountArray.length-1].account_id;
    })
  }

  onSelectedAccount(value){
    if(value ! = 0){
      this.sendfax.account_id = value
    }
    else{
      this.sendfax.account_id = undefined;
    }
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
