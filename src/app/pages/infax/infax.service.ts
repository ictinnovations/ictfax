import { Injectable } from '@angular/core';
import { Http, Response, HttpModule, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { AppService } from '../../../app/app.service';
import { getFileNameFromResponseContentDisposition, saveFile } from '../../file-download-helper';
import { NotificationService } from '../sendfax/notification.service';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class InFaxService {

  constructor(private app_service: AppService, private notificationService: NotificationService, private http: Http) { }

  // get_InFaxTransmissionList() {
  //   const headers = new Headers();
  //   this.app_service.createAuthorizationHeader(headers);
  //   const options = new RequestOptions({ headers: headers});
  //   const getUrl = `${this.app_service.apiUrlTransmission}`;
  //   return this.http.get(getUrl, options).toPromise()
  //   .then(response => response.json()).catch(response => this.app_service.handleError(response));
  // }

get_InFaxTransmissionList(): Promise<any[]> {
  const headers = new Headers();
  this.app_service.createAuthorizationHeader(headers);
  const options = new RequestOptions({ headers: headers});
  const getUrl = `${this.app_service.apiUrlTransmission}?direction=inbound`;

  return this.http.get(getUrl, options).toPromise()
    .then(response => {
      const transmissions = response.json() as any[];

      // Check if this is not the first load by seeing if we have previous transmissions stored
      const previousTransmissions = this.getStoredInboundTransmissions();

      if (previousTransmissions && previousTransmissions.length > 0) {
        // Find new transmissions that weren't in the previous list
        const newTransmissions = transmissions.filter(newTrans =>
          !previousTransmissions.some(oldTrans => oldTrans.id === newTrans.id)
        );

        // Show notifications for new incoming faxes
        newTransmissions.forEach(transmission => {
          const status = transmission.status || 'Received';
          this.notificationService.addNotification({
            type: 'info',
            message: `Incoming fax ${transmission.id} ${status.toLowerCase()}`,
            transmissionId: transmission.id
          });
        });
      }

      // Store current transmissions for next comparison
      this.storeInboundTransmissions(transmissions);

      return transmissions;
    })
    .catch(response => this.app_service.handleError(response));
}

// Helper methods to store and retrieve previous transmissions
private storeInboundTransmissions(transmissions: any[]): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('inbound_fax_cache', JSON.stringify({
      data: transmissions,
      timestamp: new Date().getTime()
    }));
  }
}

private getStoredInboundTransmissions(): any[] {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('inbound_fax_cache');
    if (stored) {
      const cache = JSON.parse(stored);
      // Only use cache if it's less than 1 hour old
      if (new Date().getTime() - cache.timestamp < 3600000) {
        return cache.data;
      }
    }
  }
  return [];
}


  get_Documentdownload(document_id): any {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    options.responseType = ResponseContentType.Blob;
    const url = `${this.app_service.apiUrlDocument}/${document_id}/media`;
    this.http.get(url, options).subscribe(res => {
      const fileName = getFileNameFromResponseContentDisposition(res);
      saveFile(res.blob(), fileName);
    }, error => {
      this.app_service.downloadError(error);
    });
  }

  getTransmissionResult(transmission_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const getUrl = `${this.app_service.apiUrlTransmission}/${transmission_id}/results?name=document`;
    return this.http.get(getUrl, options).toPromise()
    .then(response => response.json()).catch(response => this.app_service.handleError(response));
  }
  delete_Transmission(transmission_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deletetransmissionUrl = `${this.app_service.apiUrlTransmission}/${transmission_id}`;
    return this.http.delete(deletetransmissionUrl, options).toPromise().then(response => response.json())
    .catch(response => this.app_service.handleError(response));
  }
  confirmed_Download(transmission_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const confirmedtransmissionUrl = `${this.app_service.apiUrlTransmission}/downloaded/${transmission_id}`;
    return this.http.delete(confirmedtransmissionUrl, options).toPromise().then(response => response.json())
    .catch(response => this.app_service.handleError(response));
  }
  searchFaxes(queryParams: any): Promise<any[]> {
      const headers = new Headers();
      this.app_service.createAuthorizationHeader(headers);
      const options = new RequestOptions({ headers: headers });
      queryParams.service_flag = 2;
      queryParams.direction = 'inbound';
      const queryString = Object.keys(queryParams).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      ).join('&');
      const url = `${this.app_service.apiUrlTransmission}?${queryString}`;
      return this.http.get(url, options).toPromise()
        .then(response => response.json() as any[])
        .catch(response => this.app_service.handleError(response));
    }
}
