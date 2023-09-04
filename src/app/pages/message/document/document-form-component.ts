import { Component, OnInit, Input, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Headers, Response, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Document } from './document';
import { DocumentService } from './document.service';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../../../app.service';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload/ng2-file-upload';
import { NgClass, NgStyle } from '@angular/common';
import { createWorker, Worker } from 'tesseract.js';
import * as Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';



@Component({
  selector: 'ngx-add-document-component',
  templateUrl: './document-form-component.html',
  styleUrls: ['./document-form-component.scss'],
})

export class AddDocumentComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private document_service: DocumentService, private app_service: AppService,
    private router: Router) { }



  selectedFile: File | null = null;
  extractedText: string | null = null;
  form1: any = {};
  file: any = [];
  document: Document = new Document;
  document_id: any = null;
  URL = `${this.app_service.apiUrlDocument}/${this.document_id}/media`;
  public uploader: FileUploader = new FileUploader({ url: this.URL, disableMultipart: true });

  unsupportedErr: any = false;
  text: string = '';
  worker: Tesseract.Worker | null = null; 
  isError = false;
  errorText: any = [];
  


  ngOnInit(): void {

    createWorker({
      logger: m => console.log(m),
    }).then(worker => {
      this.worker = worker;
    });
    this.route.params.subscribe(params => {
      this.document_id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        this.document.quality = 'standard';
        return null;
      } else {
        return this.document_service.get_DocumentData(this.document_id).then(data => {
          this.document = data;
        });
      }
    });

    this.uploader.onBeforeUploadItem = (item) => {
      item.method = 'POST';
      item.url = this.URL;
      item.withCredentials = false;
    };

    this.uploader.onAfterAddingFile = (response: any) => {
      this.file = response;
      if (response.file.type == 'application/pdf' || response.file.type == 'image/png' || response.file.type == 'image/jpg' || response.file.type == 'image/jpeg' || response.file.type == 'image/tiff' || response.file.type == 'image/tif' || response.file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || response.file.type == 'application/msword' || response.file.type == 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || response.file.type == 'application/vnd.ms-powerpoint' || response.file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || response.file.type == 'application/vnd.ms-excel' || response.file.type == 'application/vnd.oasis.opendocument.text' || response.file.type == 'application/vnd.oasis.opendocument.presentation' ||  response.file.type == 'application/vnd.oasis.opendocument.spreadsheet') {
        
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

  }

  addDocument(): void {
    this.document_service.add_Document(this.document).then(response => {
      const document_id = response;
      this.URL = `${this.app_service.apiUrlDocument}/${document_id}/media`;
      this.upload();
      this.router.navigate(['../../document'], { relativeTo: this.route });
    });
  }

 
  updateDocument(): void {
    this.checkFields();
    if (this.errorText.length === 0) {
      this.document_service.update_Document(this.document).then((response) => {
        this.URL = `${this.app_service.apiUrlDocument}/${this.document_id}/media`;
        if (this.file != null) {
          this.upload();
        }
        this.router.navigate(['../../document'], {relativeTo: this.route});
      })
      .catch(this.handleError);
    }else{
      this.errorHandler(true, this.errorText);
    }
  }

  uploadDocument(): void {
    this.document_service.upload_Document(this.document)
    .then((response) => {
      this.router.navigate(['../../document'], {relativeTo: this.route});
    });
  }

  upload () {
    this.uploader.uploadAll();
  }

  private checkFields(status = null):any{
    this.errorHandler(false, [])
    if (!this.document.name) this.errorText.push("Document name is required.");
    // if (this.file == null) this.errorText.push("Document file is required.");
  }

  async recognizeText(path: string, isPDF: boolean = false) {
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
    let extractedText; // Rename the local variable to avoid conflicts with this.text

    if (isPDF) {
      const pdf = await pdfjsLib.getDocument(path).promise;
      const numPages = pdf.numPages;
      const pageTexts = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => this.getTextFromItem(item)).join(' ');
        pageTexts.push(pageText);
      }

      extractedText = pageTexts.join('\n');
    } else {
      const { data: { text } } = await this.worker.recognize(path);
      extractedText = text; // Assign extracted text to the local variable
      console.log('Extracted Text:', text);
    }

    // Update the document.ocr field with the extracted text
    this.document.ocr = extractedText; // Use the local variable to assign the text

    await this.worker.terminate();
  }


  getTextFromItem(item) {
    if (typeof item.str === 'string') {
      return item.str;
    } else if (typeof item.markedContent === 'string') {
      return item.markedContent;
    } else {
      return '';
    }
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const path = (window.URL || window.webkitURL).createObjectURL(file);

      if (file.type === 'application/pdf') {
        await this.recognizeText(path, true);
      } else if (file.type === 'image/jpeg' || file.type === 'image/png') {
        await this.recognizeText(path);
      } else {
        console.log('Unsupported file type');
      }
    }
  }
  


 

  private errorHandler(status, message):any{
    this.isError = status;
    this.errorText = message;
    if (status) {
      setTimeout(() => {
        this.isError = false;
        this.errorText = [];
      }, 10000);
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
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
