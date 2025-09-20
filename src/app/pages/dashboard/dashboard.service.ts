import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, RequestOptions } from '@angular/http';
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

  get_didStat() {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url = `${this.app_service.apiUrlDashboard}?account_type=did`;
    return this.http.get(url, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }

  get_outFaxStat() {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url = `${this.app_service.apiUrlDashboard}?service_flag=2`;
    return this.http.get(url, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }

getAllServersHealth(): Promise<any> {
  const headers = new Headers();
  this.app_service.createAuthorizationHeader(headers);
  const options = new RequestOptions({ headers });
  const url = `${this.app_service.apiUrlSystem}/cpuhealth`; // all servers
  return this.http.get(url, options).toPromise()
    .then(res => res.json())
    .catch(err => this.app_service.handleError(err));
}

getServerHealth(node_id: number): Promise<any> {
  const headers = new Headers();
  this.app_service.createAuthorizationHeader(headers);
  const options = new RequestOptions({ headers });
  const url = `${this.app_service.apiUrlSystem}/server/${node_id}/health/history`; // single server
  return this.http.get(url, options).toPromise()
    .then(res => res.json())
    .catch(err => this.app_service.handleError(err));
}

checkAllServersHealth(): Promise<any> {
  const headers = new Headers();
  this.app_service.createAuthorizationHeader(headers);
  const options = new RequestOptions({ headers });
  const url = `${this.app_service.apiUrlSystem}/health/check`; // POST request
  return this.http.post(url, {}, options).toPromise()
    .then(res => res.json())
    .catch(err => this.app_service.handleError(err));
}


getFaxStats(range: string, start?: string, end?: string): Promise<any> {
  const headers = new Headers();
  this.app_service.createAuthorizationHeader(headers);
  const options = new RequestOptions({ headers });

  let url = `${this.app_service.apiUrl}/kpi/fax-stats?range=${range}`;

  if (range === 'custom' && start && end) {
    url += `&start=${start}&end=${end}`;
  }

  return this.http.get(url, options).toPromise()
    .then(res => res.json())
    .catch(err => this.app_service.handleError(err));
}


  getFaxStatsV2(range: string = 'daily', start?: string, end?: string) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);

    let params: any = { range };
    if (start && end) {
      params.start = start;
      params.end = end;
    }

    const options = new RequestOptions({ headers, params });
    const url = `${this.app_service.apiUrlSystem}/kpi/fax-stats-v2`;

    return this.http.get(url, options)
      .map(res => res.json())
      .catch(err => this.app_service.handleError(err));
  }

 
  getFaxDetails(
    key: string,
    status: string = 'all',
    direction: string = 'all',
    limit: number = 50,
    offset: number = 0
  ) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);

    const params: any = {
      key,
      status,
      direction,
      limit,
      offset
    };

    const options = new RequestOptions({ headers, params });
    const url = `${this.app_service.apiUrlSystem}/kpi/fax-details`;

    return this.http.get(url, options)
      .map(res => res.json())
      .catch(err => this.app_service.handleError(err));
  }


}
