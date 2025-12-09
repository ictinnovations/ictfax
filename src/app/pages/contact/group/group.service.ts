import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, Response, ResponseContentType, HttpModule, RequestOptions } from '@angular/http';
import { Group } from './group';
import { AppService } from '../../../../app/app.service';
import { saveFile, getFileNameFromResponseContentDisposition } from '../../../file-download-helper';
import * as FileSaver from 'file-saver';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class GroupService {

  aGroup: Group[]= [];
  group_id: any= null;
  group: Group= new Group;

  constructor(private http: Http, private app_service: AppService) {}

  get_GroupList(): Promise<Group[]> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    return this.http.get(this.app_service.apiUrlGroups, options).toPromise()
    .then(response => response.json() as Group[]).catch(response => this.app_service.handleError(response));
  }

  get_GroupData(group_id): Promise<Group> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlGroups}/${group_id}`;
    return this.http.get(url5, options).toPromise()
    .then(response => response.json() as Group).catch(response => this.app_service.handleError(response));
  }

  add_Group(group: Group): Promise<Group> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(group);
    const addUrl = `${this.app_service.apiUrlGroups}`;
    return this.http.post(addUrl, body, options).toPromise().then(response => response.json() as Group)
    .catch(response => this.app_service.handleError(response));
  }

  update_Group(group: Group): Promise<Group> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(group);
    const updateUrl = `${this.app_service.apiUrlGroups}/${group.group_id}`;
    return this.http.put(updateUrl, body, options).toPromise().then(response => response.json() as Group)
    .catch(response => this.app_service.handleError(response));
  }

  delete_Group(group_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteUrl = `${this.app_service.apiUrlGroups}/${group_id}`;
    return this.http.delete(deleteUrl, options).toPromise().then(response => response.json() as Group)
    .catch(response => this.app_service.handleError(response));
  }

  getSampleCSV() {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    options.responseType = ResponseContentType.Blob;
    const url = `${this.app_service.apiUrlGroups}/sample/csv`;
    this.http.get(url, options).subscribe(res => {
      const fileName = getFileNameFromResponseContentDisposition(res);
      saveFile(res.blob(), fileName);
    }, error => {
      this.app_service.downloadError(error);
    });
  }

  getContactCSV(group_id): any {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    options.responseType = ResponseContentType.Blob;
    const url = `${this.app_service.apiUrlGroups}/${group_id}/csv`;
    this.http.get(url, options).subscribe(res => {
      const fileName = getFileNameFromResponseContentDisposition(res);
      saveFile(res.blob(), fileName);
    }, error => {
      this.app_service.downloadError(error);
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
