import { Injectable, Component } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { NbAuthService, NbTokenService, NbAuthJWTToken } from '@nebular/auth';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../environments/environment';

@Injectable()

export class AppService {

  constructor(private http: Http, private router: Router, private _location: Location) {
    this.upload_Header.push({name: 'Authorization', value: 'Bearer ' + localStorage.getItem('auth_app_token')});
  }
  // headers for uploading the file
  upload_Header: Array<{
    name: string;
    value: string;
  }> = [];

  showMessages: any = {};
  public errors: string;
  public messages: string[] = [];
  public abc: any;
  public def: any;
  public err_code: string;
  public err_message: string;

  apiUrl= environment.API_URL;

  apiUrlContacts= `${this.apiUrl}/contacts`;
  apiUrlDocument= `${this.apiUrl}/documents`;
  apiUrlText= `${this.apiUrl}/texts`;
  apiUrlRecording= `${this.apiUrl}/recordings`;
  apiUrlTemplate= `${this.apiUrl}/templates`;
  apiUrlTransmission= `${this.apiUrl}/transmissions`;
  apiUrlPrograms= `${this.apiUrl}/programs`;
  apiUrlProviders = `${this.apiUrl}/providers`;
  apiUrlUsers = `${this.apiUrl}/users`;
  apiUrlGroups = `${this.apiUrl}/groups`;
  apiUrlCampaigns = `${this.apiUrl}/campaigns`;
  apiUrlDashboard = `${this.apiUrl}/statistics`;
  apiUrlAccounts = `${this.apiUrl}/accounts`;
  apiUrlDid = `${this.apiUrl}/dids`;

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', ' Bearer ' + localStorage.getItem('auth_app_token'));
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    if (error.status === 0 || error.status === 500) {
      this.router.navigate(['pages/Error']);
    }
    if (error.status === 401) {
      this.router.navigate(['auth/login']);
    }
    if (error.status === 403) {
      this._location.back();
    }
    if (error.status === 404 ) {
      this.def = JSON.parse(error._body);
      this.err_code = this.def.error.code;
      // this.err_code = "403";
      this.err_message = this.def.error.message;
      this.abc = this.err_code + ', ' + this.err_message;
      this.errors = this.abc;
    }
    return Promise.reject(error.message || error);
  }

  public downloadError(error: any): Promise<any> {
    console.error('An error occurred', error);
    this.errors = error.status + ' ' + error.statusText;
    return Promise.reject(error.message || error);
  }

}
