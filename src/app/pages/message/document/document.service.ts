import {Injectable} from '@angular/core';
import {Headers} from '@angular/http';
import {Http, Response, HttpModule, RequestOptions, ResponseContentType} from '@angular/http';
import {Document} from './document';
import {AppService} from '../../../../app/app.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as FileSaver from 'file-saver';
import { getFileNameFromResponseContentDisposition, saveFile } from '../../../file-download-helper';


@Injectable()

export class DocumentService {

  aDocument: Document[] = [];
  document_id:any =null;
  document: Document = new Document;

  constructor(private http: Http, private app_service: AppService) { }

  URL = `${this.app_service.apiUrlDocument}/${this.document_id}/media`;

  get_DocumentList(): Promise<Document[]> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    return this.http.get(this.app_service.apiUrlDocument, options).toPromise()
    .then(response => response.json() as Document[]).catch(response => this.app_service.handleError(response));
  }

  get_DocumentData(document_id): Promise<Document> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlDocument}/${document_id}`;
    return this.http.get(url5, options).toPromise()
    .then(response => response.json() as Document).catch(response => this.app_service.handleError(response));
  }

  get_ViewFaxDocument(document_id): any {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    options.responseType = ResponseContentType.Blob;
    const url = `${this.app_service.apiUrlDocument}/${document_id}/media`;
    return url;
    // this.http.get(url, options).subscribe(res => {
    //   return res.url;
    //   // console.log(res.url);
    //   // const fileName = getFileNameFromResponseContentDisposition(res);
    //   // saveFile(res.blob(), fileName);
    // }, error => {
    //   this.app_service.downloadError(error);
    // });
  }

  get_Documentdownload(document_id, transmission_id = null): any {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    options.responseType = ResponseContentType.Blob;
    const url = `${this.app_service.apiUrlDocument}/${document_id}/media`;
    if(transmission_id){
      const url_doc = `${this.app_service.apiUrlDocument}/${document_id}/media/${transmission_id}`;
      }
    this.http.get(url, options).subscribe(res => {
      const fileName = getFileNameFromResponseContentDisposition(res);
      saveFile(res.blob(), fileName);
    }, error => {
      this.app_service.downloadError(error);
    });
  }

  add_Document(document: Document) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(document);
    const addDocumentUrl = `${this.app_service.apiUrlDocument}`;
    return this.http.post(addDocumentUrl, body, options).toPromise().then(response => response.json())
    .catch(response => this.app_service.handleError(response));
  }

  update_Document(document: Document): Promise<Document> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(document);
    const updateDocumentUrl = `${this.app_service.apiUrlDocument}/${document.document_id}`;
    return this.http.put(updateDocumentUrl, body, options).toPromise().then(response => response.json() as Document)
    .catch(response => this.app_service.handleError(response));
  }

  upload_Document(document: Document): Promise<Document> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(document);
    const uploadDocumentUrl = `${this.app_service.apiUrlDocument}/${document.document_id}/media`;
    return this.http.put(uploadDocumentUrl, body, options).toPromise().then(response => response.json() as Document)
    .catch(response => this.app_service.handleError(response));
  }

  delete_Document(document_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteDocumentUrl = `${this.app_service.apiUrlDocument}/${document_id}`;
    return this.http.delete(deleteDocumentUrl, options).toPromise().then(response => response.json() as Document)
    .catch(response => this.app_service.handleError(response));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
