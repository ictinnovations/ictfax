import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http, RequestOptions, Headers, ResponseContentType, } from '@angular/http';
import { AppService } from '../../app.service';
import { ContactDNC } from './contact_dnc';
import { getFileNameFromResponseContentDisposition, saveFile } from '../../file-download-helper';

@Injectable({
  providedIn: 'root'
})
export class ContactDNCService {

  constructor(private http: Http, private app_service: AppService) { }

  get_ContactDNCList() {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers });
    return this.http.get(this.app_service.apiUrlContactDNC, options).toPromise()
      .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }

  get_ContactDNCData(contact_dnc_id): Promise<ContactDNC> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const url5 = `${this.app_service.apiUrlContactDNC}/${contact_dnc_id}`;
    return this.http.get(url5, options).toPromise()
      .then(response => response.json() as ContactDNC).catch(response => this.app_service.handleError(response));
  }

  add_ContactDNC(contact_dnc: ContactDNC): Promise<ContactDNC> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify(contact_dnc);
    const addUrl = `${this.app_service.apiUrlContactDNC}`;
    return this.http.post(addUrl, body, options).toPromise().then(response => response.json())
      .catch(response => this.app_service.handleError(response));
  }
  update_ContactDNC(contact_dnc: ContactDNC): Promise<ContactDNC> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const body = JSON.stringify(contact_dnc);
    const updateUrl = `${this.app_service.apiUrlContactDNC}/${contact_dnc.contact_dnc_id}`;
    return this.http.put(updateUrl, body, options).toPromise().then(response => response.json())
      .catch(response => this.app_service.handleError(response));
  }
  delete_ContactDNC(contact_dnc_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers });
    const deleteUrl = `${this.app_service.apiUrlContactDNC}/${contact_dnc_id}`;
    return this.http.delete(deleteUrl, options).toPromise().then(response => response.json() as ContactDNC)
      .catch(response => this.app_service.handleError(response));
  }

  getContactDNCCSV(): any {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    options.responseType = ResponseContentType.Blob;
    const url = `${this.app_service.apiUrlContactDNC}/contactdncs/csv`;
    this.http.get(url, options).subscribe(res => {
      const fileName = getFileNameFromResponseContentDisposition(res);
      saveFile(res.blob(), fileName);
    }, error => {
      this.app_service.downloadError(error);
    });
  }


}