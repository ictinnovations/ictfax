import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, Response, HttpModule, RequestOptions } from '@angular/http';
import { IncomingCIDNumber } from './incoming_cid_number';
import { AppService } from '../../app.service';

import 'rxjs/add/operator/toPromise';

@Injectable()

export class IncomingCIDNumberService {

  constructor(private http: Http, private app_service: AppService) {}

  get_List(user_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const getUrl = `${this.app_service.apiUrlUsers}/${user_id}/accounts?type=did`;
    return this.http.get(getUrl, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }

  get_Data(account_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const getApi = `${this.app_service.apiUrlAccounts}/${account_id}`;
    return this.http.get(getApi, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }

  search_account_Data(email) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const getApi = `${this.app_service.apiUrlAccounts}?email=${email}&type=account`;
    return this.http.get(getApi, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }

  forward_did(incoming_number) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const body = JSON.stringify(incoming_number);
    const url = `${this.app_service.apiUrlAccounts}/${incoming_number.account_id}/programs/${incoming_number.program_name}`;
    return this.http.put(url, body, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }

  forwardtoext(incoming_number) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const body = JSON.stringify(incoming_number);
    const url = `${this.app_service.apiUrlPrograms}/forward`;
    return this.http.post(url, body, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }

  update_account(account) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const body = JSON.stringify(account);
    const updateUrl = `${this.app_service.apiUrlAccounts}/${account.account_id}`;
    return this.http.put(updateUrl, body, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
