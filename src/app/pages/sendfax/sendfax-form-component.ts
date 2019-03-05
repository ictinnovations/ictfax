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

@Component({
  selector: 'ngx-add-sendfax-component',
  templateUrl: './sendfax-form-component.html',
  styleUrls: ['./sendfax-form-component.scss'],
})

export class AddSendFaxComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private document_service: DocumentService,
  private sendfax_service: SendFaxService, private router: Router, private app_service: AppService) { }


  form1: any = {};
  documentProgram: DocumentProgram = new DocumentProgram;
  program_id: any = null;
  sendfax: SendFax = new SendFax;
  documentArray: Document[] = [];
  document: Document = new Document;
  selectedDocument: any;
  trans_id: number;

  file: any = [];
  document_id:any;
  URL = `${this.app_service.apiUrlDocument}/${this.document_id}/media`;
  public uploader: FileUploader = new FileUploader({url: this.URL, disableMultipart: true });


  ngOnInit(): void {
    this.getDocumentlist();

    this.selectedDocument = 0;

    this.uploader.onBeforeUploadItem = (item) => {
      item.method = 'POST';
      item.url = this.URL;
    };

    this.uploader.onAfterAddingFile = (response: any) => {
      this.file = response;
    };

    const authHeader = this.app_service.upload_Header;
    const uploadOptions = <FileUploaderOptions>{headers : authHeader};
    this.uploader.setOptions(uploadOptions);

    this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
    };
  }

  sendnewFax() {
    if (this.selectedDocument == 0) {
      this.addDocument();
    }
    else {
      this.addSendDocument();
    }
  }

  addSendDocument(): void {
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
      let newEntry:Document = new Document;
      newEntry.document_id = 0;
      newEntry.name = '--Upload new Document--';
      this.documentArray = data;
      this.documentArray.unshift(newEntry);
    });
  }

  onSelect(value) {
    this.selectedDocument = value;
    this.documentProgram.document_id = value;
  }

  addDocument(): void {
    this.document_service.add_Document(this.document).then(response => {
      const document_id = response;
      this.documentProgram.document_id = response;
      this.URL = `${this.app_service.apiUrlDocument}/${document_id}/media`;
      this.upload();
      this.addSendDocument();
    });
  }

  upload () {
    this.uploader.uploadAll();
  }

  private hasBaseDropZoneOver = false;
  private hasAnotherDropZoneOver = false;

  private fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  private fileOverAnother(e: any) {
    this.hasAnotherDropZoneOver = e;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
