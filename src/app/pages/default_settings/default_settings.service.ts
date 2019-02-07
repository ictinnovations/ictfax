import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, Response, HttpModule, RequestOptions } from '@angular/http';
import { AppService } from '../../../app/app.service';

import 'rxjs/add/operator/toPromise';

@Injectable()

export class DefaultSettingsService {

  constructor(private http: Http, private app_service: AppService) { }

  getDefConf() {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const getUrl = `${this.app_service.apiUrlAccounts}`;
    return this.http.get(getUrl, options).toPromise().then(response => response.json())
    .catch(err => this.app_service.handleError(err));
  }

}
