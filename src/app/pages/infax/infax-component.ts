import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { Headers, RequestOptions, Http } from '@angular/http';
import { Transmission } from '../transmission/transmission';
import { InFaxService } from './infax.service';
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
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<Transmission>,
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

  items_page = [5, 10, 25, 100];
  pageSize = 10;
  startIndex: number = 0;
  currentPage: number;
  total_pages: number;
  minimumItems: number;
  current_items: any[] = [];


  displayedColumns= ['transmission_id','username', 'phone', 'status', 'Timestamp', 'Operations'];



  @ViewChild('filter') filter: ElementRef;


  ngOnInit() {
    this.getInFaxList();
  }

  getInFaxList() {
    this.infax_service.get_InFaxTransmissionList().then(data => {
      this.aInFax = data
        .filter(fax => fax.direction === 'inbound') 
        .sort((a, b) => b.transmission_id - a.transmission_id);
      this.length = this.aInFax.length;
      this.aInFax.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      });
     this.paginate(this.pageSize);
      this.InFaxDataSource = this.dataSourceBuilder.create(this.current_items.map(item => ({ data: item })));
  });    
  }


  downloadDocument(transmission_id) {
    this.infax_service.getTransmissionResult(transmission_id).then(response =>  {
      this.document_id = response[0].data;
      this.document_service.get_Documentdownload(this.document_id, null);
    });
  }

  paginate(page_Items: string | number) {
    if (typeof page_Items === 'string') {
      if (page_Items === 'next') {
        if (this.startIndex + this.pageSize < this.length) {
          this.startIndex += this.pageSize; 
        }
      } else if (page_Items === 'previous') {
        if (this.startIndex > 0) {
          this.startIndex -= this.pageSize;
        }
      }
    } else {
      this.pageSize = page_Items;
      this.startIndex = 0; 
    }
    this.currentPage = Math.floor(this.startIndex / this.pageSize) + 1;
    this.total_pages = Math.ceil(this.length / this.pageSize);
    this.minimumItems = Math.min(this.startIndex + this.pageSize, this.length);    
    
    const end = Math.min(this.startIndex + this.pageSize, this.length);
    this.current_items = this.aInFax.slice(this.startIndex, end); 
    this.InFaxDataSource = this.dataSourceBuilder.create(this.current_items.map(item => ({ data: item })));
  }

  // downloadDocument(document_id) {
  //   this.document_service.get_Documentdownload(document_id);
  // }




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

