import { Injectable } from '@angular/core';
import { Http, Response, HttpModule, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { AppService } from '../../../app/app.service';
import { getFileNameFromResponseContentDisposition, saveFile } from '../../file-download-helper';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class InFaxService {

  constructor(private app_service: AppService, private http: Http) { }

  get_InFaxTransmissionList() {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const getUrl = `${this.app_service.apiUrlTransmission}?service_flag=2&direction=inbound`;
    return this.http.get(getUrl, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }

  get_Documentdownload(document_id): any {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    options.responseType = ResponseContentType.Blob;
    const url = `${this.app_service.apiUrlDocument}/${document_id}/media`;
    this.http.get(url, options).subscribe(res => {
      const fileName = getFileNameFromResponseContentDisposition(res);
      saveFile(res.blob(), fileName);
    }, error => {
      this.app_service.downloadError(error);
    });
  }

  getTransmissionResult(transmission_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const getUrl = `${this.app_service.apiUrlTransmission}/${transmission_id}/results?name=document`;
    return this.http.get(getUrl, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }
}
