import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { User } from '../../pages/user/user';
import { AppService } from '../../../app/app.service';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';
import { NbAuthResult } from '@nebular/auth';

@Injectable({ providedIn: 'root' })

export class SigninService {

    aUser: User[]= [];
    user_id: any = null;
    user: User= new User;

  constructor(private http: Http, private app_service: AppService) {}

  saml_login(usr){
    const headers = new Headers();
    this.app_service.loginAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const body = JSON.stringify(usr);
    const url = `${this.app_service.apiUrlSSO}`;
    return this.http.post(url, body, options).toPromise()
    .then(response => response.json() as User).catch(response => this.app_service.handleError(response));
  }

  get_payload(token){
    const headers = new Headers();
    this.app_service.loginAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const body = JSON.stringify({"token": token});
    const url = `${this.app_service.apiUrlTokenPayload}`;
    return this.http.post(url, body, options).toPromise()
    .then(response => response.json() as User).catch(response => this.app_service.handleError(response));
  }

  requestPassword(email) {
    const headers = new Headers();
    this.app_service.ForgotAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url = `${this.app_service.apiUrlForgotPassword}`;
    const body = JSON.stringify({email});
    return this.http.post(url, body, options).toPromise()
    .then(response => response.json() as User).catch(response => this.app_service.handleError(response));
  }

  resetPassword(password, code) {
    const headers = new Headers();
    this.app_service.ResetAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url = `${this.app_service.apiUrlUpdatePassword}`;
    const body = JSON.stringify({"password":password,"code":code});
    return this.http.put(url, body, options).toPromise()
    .then(response => response.json() as User).catch(response => this.app_service.handleError(response));
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }




}
