import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, Response, HttpModule, RequestOptions } from '@angular/http';
import { User } from './user';
import { AppService } from '../../../app/app.service';

import 'rxjs/add/operator/toPromise';

@Injectable()

export class AUserService {

  aUser: User[]= [];
  user_id: any= null;
  user: User= new User;

  constructor(private http: Http, private app_service: AppService) {}

  get_UserList(): Promise<User[]> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    return this.http.get(this.app_service.apiUrlUsers, options).toPromise()
    .then(response => response.json() as User[]).catch(response => this.app_service.handleError(response));
  }

  get_UserData(user_id): Promise<User> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlUsers}/${user_id}`;
    return this.http.get(url5, options).toPromise()
    .then(response => response.json() as User).catch(response => this.app_service.handleError(response));
  }

  add_User(user: User): Promise<User> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(user);
    const addUrl = `${this.app_service.apiUrlUsers}`;
    return this.http.post(addUrl, body, options).toPromise().then(response => response.json() as User)
    .catch(response => this.app_service.handleError(response));
  }

  update_User(user: User): Promise<User> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(user);
    const updateUrl = `${this.app_service.apiUrlUsers}/${user.user_id}`;
    return this.http.put(updateUrl, body, options).toPromise().then(response => response.json() as User)
    .catch(response => this.app_service.handleError(response));
  }

  delete_User(user_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteUrl = `${this.app_service.apiUrlUsers}/${user_id}`;
    return this.http.delete(deleteUrl, options).toPromise().then(response => response.json() as User)
    .catch(response => this.app_service.handleError(response));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
