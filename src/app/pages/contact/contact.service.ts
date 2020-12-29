import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, Response, HttpModule, RequestOptions } from '@angular/http';
import { Contact } from './contact';
import { AppService } from '../../../app/app.service';

import 'rxjs/add/operator/toPromise';

@Injectable()

export class ContactService {

  aContact: Contact[]= [];
  contact_id: any= null;
  contact: Contact= new Contact;

  constructor(private http: Http, private app_service: AppService) {}

  get_ContactList() {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    return this.http.get(this.app_service.apiUrlContacts, options).toPromise()
    .then(response => response.json() ).catch(response => this.app_service.handleError(response));
  }

  get_ContactData(contact_id): Promise<Contact> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlContacts}/${contact_id}`;
    return this.http.get(url5, options).toPromise()
    .then(response => response.json() as Contact).catch(response => this.app_service.handleError(response));
  }

  add_Contact(contact: Contact): Promise<Contact> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(contact);
    const addUrl = `${this.app_service.apiUrlContacts}`;
    return this.http.post(addUrl, body, options).toPromise().then(response => response.json() as Contact)
    .catch(response => this.app_service.handleError(response));
  }

  update_Contact(contact: Contact): Promise<Contact> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(contact);
    const updateUrl = `${this.app_service.apiUrlContacts}/${contact.contact_id}`;
    return this.http.put(updateUrl, body, options).toPromise().then(response => response.json() as Contact)
    .catch(response => this.app_service.handleError(response));
  }

  delete_Contact(contact_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteUrl = `${this.app_service.apiUrlContacts}/${contact_id}`;
    return this.http.delete(deleteUrl, options).toPromise().then(response => response.json() as Contact)
    .catch(response => this.app_service.handleError(response));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
