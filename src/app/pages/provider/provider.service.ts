import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, Response, HttpModule, RequestOptions } from '@angular/http';
import { Provider } from './provider';
import { AppService } from '../../../app/app.service';

import 'rxjs/add/operator/toPromise';

@Injectable()

export class ProviderService {

  aProvider: Provider[]= [];
  provider_id: any= null;
  provider: Provider= new Provider;

  constructor(private http: Http, private app_service: AppService) {}

  get_ProviderList(): Promise<Provider[]> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    return this.http.get(this.app_service.apiUrlProviders, options).toPromise()
    .then(response => response.json() as Provider[]).catch(response => this.app_service.handleError(response));
  }

  get_ProviderData(provider_id): Promise<Provider> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlProviders}/${provider_id}`;
    return this.http.get(url5, options).toPromise()
    .then(response => response.json() as Provider).catch(response => this.app_service.handleError(response));
  }

  add_Provider(provider: Provider): Promise<Provider> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(provider);
    const addUrl = `${this.app_service.apiUrlProviders}`;
    return this.http.post(addUrl, body, options).toPromise().then(response => response.json() as Provider)
    .catch(response => this.app_service.handleError(response));
  }

  update_Provider(provider: Provider): Promise<Provider> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(provider);
    const updateUrl = `${this.app_service.apiUrlProviders}/${provider.provider_id}`;
    return this.http.put(updateUrl, body, options).toPromise().then(response => response.json() as Provider)
    .catch(response => this.app_service.handleError(response));
  }

  delete_Provider(provider_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteUrl = `${this.app_service.apiUrlProviders}/${provider_id}`;
    return this.http.delete(deleteUrl, options).toPromise().then(response => response.json() as Provider)
   .catch(response => this.app_service.handleError(response));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
