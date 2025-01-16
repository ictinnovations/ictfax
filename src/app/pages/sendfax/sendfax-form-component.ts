import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { SendFax, DocumentProgram } from './sendfax';
import { SendFaxService } from './sendfax.service';
import { DocumentService } from '../message/document/document.service';
import { Document } from '../message/document/document';
import { FileUploader , FileUploaderOptions } from 'ng2-file-upload';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload/ng2-file-upload';
import { AppService } from '../../app.service';
import 'rxjs/add/operator/toPromise';
import { Contact } from '../contact/contact';
import { ContactService } from '../contact/contact.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CID } from '../cid/cid';

@Component({
  selector: 'ngx-add-sendfax-component',
  templateUrl: './sendfax-form-component.html',
  styleUrls: ['./sendfax-form-component.scss'],
})

export class AddSendFaxComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private document_service: DocumentService,
  private sendfax_service: SendFaxService, private router: Router, private app_service: AppService, private contact_service: ContactService
  ,private completerService: CompleterService, private modalService: NgbModal) { }


  form1: any = {};
  documentProgram: DocumentProgram = new DocumentProgram;
  program_id: any = null;
  sendfax: SendFax = new SendFax;
  documentArray: Document[] = [];
  document: Document = new Document;
  accountArray: CID[] = [];
  selectedDocument: any;
  trans_id: number;
  dataService: CompleterData;
  protected searchStr: string;

  contactArray: Contact[] = [];

  public file_sending = false;

  public file_sent = false;



  file: any = [];
  document_id:any = null;
  URL = `${this.app_service.apiUrlDocument}/${this.document_id}/media`;
  public uploader: FileUploader = new FileUploader({url: this.URL, disableMultipart: true });

  unsupportedErr: any = false;

  private modalRef: NgbModalRef;


  ngOnInit(): void {

    this.getDocumentlist();
    this.getAccountlist();
    this.getContactlist();

    this.selectedDocument = 0;

    this.document.quality = 'standard';

    this.uploader.onBeforeUploadItem = (item) => {
      item.method = 'POST';
      item.url = this.URL;
      item.withCredentials = false;
    };
    
    this.uploader.onAfterAddingFile = (response: any) => {
      // console.log(response);
      this.file = response;
      if (response.file.type == 'application/pdf' || response.file.type == 'image/png' || response.file.type == 'image/jpg' || response.file.type == 'image/jpeg' || response.file.type == 'image/tiff' || response.file.type == 'image/tif') {
        
      }
      else {
        this.unsupportedErr = true;
        this.uploader.removeFromQueue(response);
        setTimeout(() => {
          this.unsupportedErr = false;
        }, 2000);
      }
    };


    const authHeader = this.app_service.upload_Header;
    const uploadOptions = <FileUploaderOptions>{headers : authHeader};
    this.uploader.setOptions(uploadOptions);

    this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
    };

    this.uploader.onCompleteAll = () => {
      console.log('complete');
      this.file_sent = true;
      this.file_sending = false;
      this.modalRef.close();
      this.getDocumentlist();
    };


    console.log(this.document.name);
  }

  sendnewFax() {
    if (this.documentProgram.document_id == 0) {
      this.addDocument();
    }
    else {
      this.addSendDocument();
    }
  }

  addSendDocument(): void {
    if (this.sendfax.contact_id != undefined) { 
        this.sendfax.phone = undefined; 
    } 
    this.sendfax_service.add_senddocument(this.documentProgram).then(response => {
      const program_id = response;
      this.sendfax.program_id = program_id;
      this.AddTransmission();
      this.router.navigate(['../../sendfax'], {relativeTo: this.route});
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
      if (this.documentArray.length > 0){
        this.documentProgram.document_id = this.documentArray[this.documentArray.length -1].document_id;
      }
      /*
      let newEntry:Document = new Document;
      newEntry.document_id = 0;
      newEntry.name = '--Upload new Document--';
      this.documentArray = data;
      this.documentArray.unshift(newEntry);
      */
    });
  }

  onSelect(value) {
    if (value != 0) {
      this.selectedDocument = value;
      this.documentProgram.document_id = value;
    }
    else {
      this.documentProgram.document_id = undefined;
    }
  }

  addDocument(): void {
    this.document_service.add_Document(this.document).then(response => {
      const document_id = response;
      this.documentProgram.document_id = response;
      this.URL = `${this.app_service.apiUrlDocument}/${document_id}/media`;
      this.upload();
    });
  }

  upload () {
    this.file_sending = true;
    this.uploader.uploadAll();
  }


  getAccountlist() {
    this.sendfax_service.get_AccountList().then(data => {
      this.accountArray = data;
      if (this.accountArray.length > 0) {
        this.sendfax.account_id = this.accountArray[this.accountArray.length - 1].account_id;
      }
    });
  }

  onSelectAccount(value) {
    if (value != 0) {
      this.sendfax.account_id = value;
    }
    else {
      this.sendfax.account_id = undefined;
    }
  }

  private hasBaseDropZoneOver = false;
  private hasAnotherDropZoneOver = false;

  private fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  private fileOverAnother(e: any) {
    this.hasAnotherDropZoneOver = e;
  }

  //Get contacts

  getContactlist() {
    this.contact_service.get_ContactList().then(data => {
      this.contactArray = data;
      this.dataService = this.completerService.local(this.contactArray, 'phone', 'phone');
    });
  }

  onSelected(item: CompleterItem) {
    console.log(item);
    if (item != null) {
      this.sendfax.contact_id = item.originalObject.contact_id;
    }
    else {
      this.sendfax.contact_id = undefined;
    }
  }

  // Fax Uploading related

  file_upload() {
    this.document_service.add_Document(this.document).then(response => {
      const document_id = response;
      this.documentProgram.document_id = response;
      this.URL = `${this.app_service.apiUrlDocument}/${document_id}/media`;
      this.upload();
    })  
  }

  // Removing related

  remove(item) {
    console.log(this.uploader.queue.length - 1);
  }
 
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  open(content) {
    console.log('open the modal');
    this.modalRef = this.modalService.open(content,  { size: 'lg' });

    this.modalRef.result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  onSave() {
    this.modalRef.close();
  }
}
