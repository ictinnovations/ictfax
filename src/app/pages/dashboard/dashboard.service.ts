import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, Response, HttpModule, RequestOptions, ResponseContentType } from '@angular/http';
import { AppService } from '../../app.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class DashboardService {

  constructor(private http: Http, private app_service: AppService) { }

  get_Statistics() {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    return this.http.get(this.app_service.apiUrlDashboard, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }
}
