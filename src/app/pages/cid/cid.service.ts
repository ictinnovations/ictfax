import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, Response, HttpModule, RequestOptions } from '@angular/http';
import { CID } from './cid';
import { AppService } from '../../../app/app.service';

import 'rxjs/add/operator/toPromise';

@Injectable()

export class CIDService {

  aCID: CID[]= [];
  account_id: any= null;
  cid: CID= new CID;

  constructor(private http: Http, private app_service: AppService) {}

  get_CIDList() {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const getUrl = `${this.app_service.apiUrlCid}`;
    return this.http.get(getUrl, options).toPromise()
    .then(response => response.json() as CID[]).catch(response => this.app_service.handleError(response));
  }

  get_CIDData(account_id): Promise<CID> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlAccounts}/${account_id}`;
    return this.http.get(url5, options).toPromise()
    .then(response => response.json() as CID).catch(response => this.app_service.handleError(response));
  }

  add_CID(cid): Promise<CID> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(cid);
    const addUrl = `${this.app_service.apiUrlCid}`;
    return this.http.post(addUrl, body, options).toPromise().then(response => response.json() as CID)
    .catch(err => this.app_service.handleError(err));
  }

  update_CID(cid): Promise<CID> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(cid);
    const updateUrl = `${this.app_service.apiUrlAccounts}/${cid.account_id}`;
    return this.http.put(updateUrl, body, options).toPromise().then(response => response.json() as CID)
    .catch(err => this.app_service.handleError(err));
  }

   assign_CID(cid): Promise<CID> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(cid);
    const assignUrl = `${this.app_service.apiUrlAccounts}/${cid.account_id}/users/${cid.user_id}`;
    return this.http.put(assignUrl, body, options).toPromise().then(response => response.json() as CID)
    .catch(err => this.app_service.handleError(err));
  }
  
  unassign_CID(cid): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteUr = `${this.app_service.apiUrlAccounts}/${cid.account_id}/users`;
    return this.http.delete(deleteUr, options).toPromise().then(response => response.json())
    .catch(err => this.handleError(err));
  }

  send_program(cid) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(cid);
    const sendProUrl = `${this.app_service.apiUrlPrograms}/faxtoemail`;
    return this.http.post(sendProUrl, body, options).toPromise().then(response => response.json() as CID)
    .catch(err => this.app_service.handleError(err));
  }

  delete_CID(account_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteUrl = `${this.app_service.apiUrlAccounts}/${account_id}`;
    return this.http.delete(deleteUrl, options).toPromise().then(response => response.json() as CID)
    .catch(err => this.app_service.handleError(err));
  }

  batch_cid(cid) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(cid);
    const batchUrl = `${this.app_service.apiUrlAccounts} Loop End`;
    return this.http.post(batchUrl, cid, options).toPromise().then(response => response.json())
    .catch(err => this.app_service.handleError(err));
  }

  no_service(account_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const noServUrl = `${this.app_service.apiUrlAccounts}/${account_id}/programs`;
    return this.http.delete(noServUrl, options).toPromise().then(response => response.json() as CID)
    .catch(err => this.app_service.handleError(err));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
