import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CIDService } from './cid.service';
import { DocumentService } from '../message/document/document.service';
import { FileUploader , FileUploaderOptions } from 'ng2-file-upload';
import { AppService } from '../../app.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'ngx-import-cid-component',
  templateUrl: './import-cid-component.html',
  styleUrls: ['./import-cid-component.scss'],
})

export class ImportCIDComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private cid_service: CIDService,
  private router: Router, private app_service: AppService, private document_service: DocumentService) { }


  form1: any= {};
  file: any;
  document_id: any = [];
  document: any;

  URL = `${this.app_service.apiUrlDocument}/${this.document_id}/media`;
  public uploader: FileUploader = new FileUploader({url: this.URL, disableMultipart: true });

  ngOnInit(): void {
    this.uploader.onBeforeUploadItem = (item) => {
      item.method = 'PUT';
      item.url = this.URL;
      item.withCredentials = false;
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

  addDocument(): void {
    this.document_service.add_Document(this.document).then(response => {
      const document_id = response;
      this.URL = `${this.app_service.apiUrlDocument}/${document_id}/media`;
      this.upload();
      this.router.navigate(['../../cid'], {relativeTo: this.route});
    });
  }

  upload () {
    this.file.upload();
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
