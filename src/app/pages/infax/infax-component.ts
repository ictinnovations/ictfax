import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { Headers, RequestOptions, Http } from '@angular/http';
import { Transmission } from '../transmission/transmission';
import { InFaxService } from './infax.service';
import { MatSort,  Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { InFaxDataSource } from './infax-datasource.component';
import { InFaxDatabase } from './infax-database.component';
import { DocumentService } from '../message/document/document.service';
import { ModalComponent } from '../../modal.component';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DocumentProgram } from '../campaigns/campaign';
import { Observable } from 'rxjs/Rx';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

@Component({
  selector: 'ngx-infax-component',
  templateUrl: './infax-component.html',
  styleUrls: ['./infax-component.scss'],
})

export class InFaxComponent implements OnInit {

  constructor(private router: Router, private infax_service: InFaxService,
    private InFaxDataSourceBuilder: NbTreeGridDataSourceBuilder<Transmission>,
    private modalService: NgbModal,    private document_service: DocumentService
  ,private app_service: AppService, private http: Http) { }

  aInFax: Transmission[];
  InFaxDataSource: NbTreeGridDataSource<Transmission>;
  length: number;
  document_id:any;
  documentProgram: DocumentProgram = new DocumentProgram;
  private modalRef: NgbModalRef;
  faxDocumentURL: string;
  totalPages: number = 0;
  page: number = 1;
  isLoaded: boolean = false;

  displayedColumns= ['ID','username', 'phone', 'status', 'Timestamp', 'Operations'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('filter') filter: ElementRef;


  ngOnInit() {
    this.getInFaxList();
  }

  getInFaxList() {
    this.infax_service.get_InFaxTransmissionList().then(data => {
      this.length = data.length;
      this.aInFax = data;

      data.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      })

      this.InFaxDataSource = this.InFaxDataSourceBuilder.create(data.map(item => ({ data: item })));

      //Sort the data automatically
      const sortState: Sort = {active: 'ID', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);

      // Observable for the filter
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
     .debounceTime(150)
     .distinctUntilChanged()
     .subscribe(() => {
       if (!this.aInFax) { return; }
       this.aInFax.filter = this.filter.nativeElement.value;
      });
    });
  }

  downloadDocument(document_id) {
    this.document_service.get_Documentdownload(document_id);
  }




  // Send Fax related Form
  open(content, document_id) {
    this.documentProgram.document_id = document_id;
    this.modalRef = this.modalService.open(content,  { size: 'md' });

    this.modalRef.result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  showPDF(pdfViewer, document_id: any) {
    this.modalRef = this.modalService.open(pdfViewer,  { size: 'md' });
    this.viewFaxDocument(document_id);
  }
  // Load PDF document
  viewFaxDocument(document_id) {
    this.totalPages = 0;
    this.isLoaded = false;
    const url = this.document_service.get_ViewFaxDocument(document_id);
    this.faxDocumentURL = url;
  }
  nextPage() {
    this.page += 1;
  }
  previousPage() {
    this.page -= 1;
  }
  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  closeModal() {
    this.modalRef.close();
  }

  async get_ContactData(contact_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlContacts}/${contact_id}`;
    return await this.http.get(url5, options).toPromise().then(response => response.json())
    .catch(err => this.app_service.handleError(err));
  }
}

