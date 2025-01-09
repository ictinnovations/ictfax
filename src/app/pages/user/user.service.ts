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

  get_RoleList() {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    return this.http.get(this.app_service.apiUrlRoles, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }

  setRole(user_id, role_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(user_id);
    const setRoleUrl = `${this.app_service.apiUrlUsers}/${user_id}/roles/${role_id}`;
    return this.http.put(setRoleUrl, body, options).toPromise().then(response => response.json())
    .catch(response => this.app_service.handleError(response));
  }

  getUserRoles(user_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url9 = `${this.app_service.apiUrlUsers}/${user_id}/roles`;
    return this.http.get(url9, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }

  deleteRoles(user_id, role_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteRoleUrl = `${this.app_service.apiUrlUsers}/${user_id}/roles/${role_id}`;
    return this.http.delete(deleteRoleUrl, options).toPromise().then(response => response.json())
    .catch(response => this.app_service.handleError(response));
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

  changePass(user) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(user);
    const updateUrl = `${this.app_service.apiUrlUsers}/${user.user_id}/password`;
    return this.http.put(updateUrl, body, options).toPromise().then(response => response.json())
    .catch(response => this.app_service.handleError(response));
  }
  get_UserAccounts(id): any {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url = `${this.app_service.apiUrlAccounts}?linkdid_id=${id}`;
    return this.http.get(url, options).toPromise()
    .then(response => response.json() as User).catch(response => this.app_service.handleError(response));
  }
  get_DeleteAccount(account_id): any {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url = `${this.app_service.apiUrlAccounts}/${account_id}`;
    return this.http.delete(url, options).toPromise()
    .then(response => response.json() as User).catch(response => this.app_service.handleError(response));
  }
  add_Account(account): any {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(account);
    const addUrl = `${this.app_service.apiUrlAccounts}`;
    return this.http.post(addUrl, body, options).toPromise().then(response => response.json())
    .catch(response => this.app_service.handleError(response));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
