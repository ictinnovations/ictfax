import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, Response, HttpModule, RequestOptions } from '@angular/http';
import { Extension } from './extension';
import { AppService } from '../../../app/app.service';

import 'rxjs/add/operator/toPromise';

@Injectable()

export class ExtensionService {

  aExtension: Extension[]= [];
  account_id: any= null;
  extension: Extension= new Extension;

  constructor(private http: Http, private app_service: AppService) {}

  get_ExtensionList(): Promise<Extension[]> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const getUrl = `${this.app_service.apiUrlAccounts}?type=extension`;
    return this.http.get(getUrl, options).toPromise()
    .then(response => response.json() as Extension[]).catch(response => this.app_service.handleError(response));
  }

  get_ExtensionData(account_id): Promise<Extension> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlAccounts}/${account_id}`;
    return this.http.get(url5, options).toPromise()
    .then(response => response.json() as Extension).catch(response => this.app_service.handleError(response));
  }

  add_Extension(account: Extension): Promise<Extension> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(account);
    const addUrl = `${this.app_service.apiUrlAccounts}`;
    return this.http.post(addUrl, body, options).toPromise().then(response => response.json() as Extension)
    .catch(this.handleError);
  }

  update_Extension(account: Extension): Promise<Extension> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(account);
    const updateUrl = `${this.app_service.apiUrlAccounts}/${account.account_id}`;
    return this.http.put(updateUrl, body, options).toPromise().then(response => response.json() as Extension)
    .catch(this.handleError);
  }

  delete_Extension(account_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteUrl = `${this.app_service.apiUrlAccounts}/${account_id}`;
    return this.http.delete(deleteUrl, options).toPromise().then(response => response.json() as Extension)
    .catch(this.handleError);
  }

  get_Settings(account_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlAccounts}/${account_id}/settings/emailtofax_coversheet`;
    return this.http.get(url5, options).toPromise()
    .then(response => response.json()).catch(err => this.handleError(err));
  }

  update_Settings(account_id, settings){
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(settings);
    const updateUrl = `${this.app_service.apiUrlAccounts}/${account_id}/settings/emailtofax_coversheet`;
    return this.http.put(updateUrl, body, options).toPromise().then(response => response.json())
    .catch(this.handleError);
  }

  delete_Settings(account_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteUrl = `${this.app_service.apiUrlAccounts}/${account_id}/settings/emailtofax_coversheet`;
    return this.http.delete(deleteUrl, options).toPromise().then(response => response.json() as Extension)
    .catch(err => this.handleError(err));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
