import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, Response, HttpModule, RequestOptions } from '@angular/http';
import { DID } from './did';
import { AppService } from '../../../app/app.service';

import 'rxjs/add/operator/toPromise';

@Injectable()

export class DIDService {

  aDID: DID[]= [];
  account_id: any= null;
  did: DID= new DID;

  constructor(private http: Http, private app_service: AppService) {}

  get_DIDList() {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const getUrl = `${this.app_service.apiUrlDid}`;
    return this.http.get(getUrl, options).toPromise()
    .then(response => response.json() as DID[]).catch(response => this.app_service.handleError(response));
  }

  get_DIDData(account_id): Promise<DID> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlAccounts}/${account_id}`;
    return this.http.get(url5, options).toPromise()
    .then(response => response.json() as DID).catch(response => this.app_service.handleError(response));
  }

  add_DID(did): Promise<DID> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(did);
    const addUrl = `${this.app_service.apiUrlDid}`;
    return this.http.post(addUrl, body, options).toPromise().then(response => response.json() as DID)
    .catch(err => this.app_service.handleError(err));
  }

  update_DID(did): Promise<DID> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(did);
    const updateUrl = `${this.app_service.apiUrlAccounts}/${did.account_id}`;
    return this.http.put(updateUrl, body, options).toPromise().then(response => response.json() as DID)
    .catch(err => this.app_service.handleError(err));
  }

   assign_DID(did): Promise<DID> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(did);
    const assignUrl = `${this.app_service.apiUrlAccounts}/${did.account_id}/users/${did.user_id}`;
    return this.http.put(assignUrl, body, options).toPromise().then(response => response.json() as DID)
    .catch(err => this.app_service.handleError(err));
  }

  send_program(did) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(did);
    const sendProUrl = `${this.app_service.apiUrlPrograms}/faxtoemail`;
    return this.http.post(sendProUrl, body, options).toPromise().then(response => response.json() as DID)
    .catch(err => this.app_service.handleError(err));
  }

  unassign_DID(did): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteUr = `${this.app_service.apiUrlAccounts}/${did.account_id}/users`;
    return this.http.delete(deleteUr, options).toPromise().then(response => response.json())
    .catch(err => this.handleError(err));
  }

  delete_DID(account_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteUrl = `${this.app_service.apiUrlAccounts}/${account_id}`;
    return this.http.delete(deleteUrl, options).toPromise().then(response => response.json() as DID)
    .catch(err => this.app_service.handleError(err));
  }

  batch_did(did) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(did);
    const batchUrl = `${this.app_service.apiUrlAccounts} Loop End`;
    return this.http.post(batchUrl, did, options).toPromise().then(response => response.json())
    .catch(err => this.app_service.handleError(err));
  }

  no_service(account_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const noServUrl = `${this.app_service.apiUrlAccounts}/${account_id}/programs`;
    return this.http.delete(noServUrl, options).toPromise().then(response => response.json() as DID)
    .catch(err => this.app_service.handleError(err));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
