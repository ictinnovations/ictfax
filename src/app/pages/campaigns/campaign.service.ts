import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, Response, HttpModule, RequestOptions } from '@angular/http';
import { Campaign, SMSProgram, DocumentProgram, VoiceCallProgram, TemplateProgram, IVRProgram } from './campaign';
import { AppService } from '../../../app/app.service';

import 'rxjs/add/operator/toPromise';

@Injectable()

export class CampaignService {

  aCampaign: Campaign[]= [];
  campaign_id: any= null;
  campaign: Campaign= new Campaign;
  smsProgram: SMSProgram = new SMSProgram;
  documentProgram: DocumentProgram = new DocumentProgram;
  templateProgram: TemplateProgram = new TemplateProgram;
  voiceProgram: VoiceCallProgram = new VoiceCallProgram;


  constructor(private http: Http, private app_service: AppService) {}

  get_CampaignList(): Promise<Campaign[]> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    return this.http.get(this.app_service.apiUrlCampaigns, options).toPromise()
    .then(response => response.json() as Campaign[]).catch(response => this.app_service.handleError(response));
  }

  get_CampaignData(campaign_id): Promise<Campaign> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlCampaigns}/${campaign_id}`;
    return this.http.get(url5, options).toPromise()
    .then(response => response.json() as Campaign).catch(response => this.app_service.handleError(response));
  }

  add_Campaign(campaign: Campaign): Promise<Campaign> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(campaign);
    const addUrl = `${this.app_service.apiUrlCampaigns}`;
    return this.http.post(addUrl, body, options).toPromise().then(response => response.json() as Campaign)
    .catch(response => this.app_service.handleError(response));
  }

  update_Campaign(campaign: Campaign): Promise<Campaign> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(campaign);
    const updateUrl = `${this.app_service.apiUrlCampaigns}/${campaign.campaign_id}`;
    return this.http.put(updateUrl, body, options).toPromise().then(response => response.json() as Campaign)
    .catch(response => this.app_service.handleError(response));
  }

  delete_Campaign(campaign_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const deleteUrl = `${this.app_service.apiUrlCampaigns}/${campaign_id}`;
    return this.http.delete(deleteUrl, options).toPromise().then(response => response.json() as Campaign)
    .catch(response => this.app_service.handleError(response));
  }

  add_sendsms(smsProgram: SMSProgram): Promise<number> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(smsProgram);
    const addSendSmsUrl = `${this.app_service.apiUrlPrograms}/sendsms`;
    return this.http.post(addSendSmsUrl, body, options).toPromise().then(response => response.json() as Number)
    .catch(response => this.app_service.handleError(response));
  }

  add_sendemail(templateProgram: TemplateProgram): Promise<number> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(templateProgram);
    const addSendEmailUrl = `${this.app_service.apiUrlPrograms}/sendemail`;
    return this.http.post(addSendEmailUrl, body, options).toPromise().then(response => response.json() as Number)
    .catch(response => this.app_service.handleError(response));
  }

  add_senddocument(documentProgram: DocumentProgram): Promise<number> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(documentProgram);
    const addSendFaxUrl = `${this.app_service.apiUrlPrograms}/sendfax`;
    return this.http.post(addSendFaxUrl, body, options).toPromise().then(response => response.json() as Number)
    .catch(response => this.app_service.handleError(response));
  }

  add_voicecall(voiceProgram: VoiceCallProgram): Promise<number> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const body = JSON.stringify(voiceProgram);
    const addSendRecordingUrl = `${this.app_service.apiUrlPrograms}/voicemessage`;
    return this.http.post(addSendRecordingUrl, body, options).toPromise().then(response => response.json() as Number)
    .catch(response => this.app_service.handleError(response));
  }

  start_campaign(campaign_id): Promise<Campaign> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const starturl = `${this.app_service.apiUrlCampaigns}/${campaign_id}/start`;
    return this.http.put(starturl, '', options).toPromise().then(response => response.json() as Campaign)
    .catch(response => this.app_service.handleError(response));
  }

  stop_campaign(campaign_id): Promise<Campaign> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const starturl = `${this.app_service.apiUrlCampaigns}/${campaign_id}/stop`;
    return this.http.put(starturl, '', options).toPromise().then(response => response.json() as Campaign)
    .catch(response => this.app_service.handleError(response));
  }

  schedule_campaign(campaign_id, action): Promise<Campaign> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const scheduleurl = `${this.app_service.apiUrlCampaigns}/${campaign_id}/${action}/schedule`;
    return this.http.post(scheduleurl, options).toPromise().then(response => response.json() as Campaign)
    .catch(response => this.app_service.handleError(response));
  }

  delete_schedule(campaign_id): Promise<any> {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({headers: headers});
    const url = `${this.app_service.apiUrlCampaigns}/${campaign_id}/schedule/cancel`;
    return this.http.delete(url, options).toPromise().then(response => response.json() as Campaign)
    .catch(response => this.app_service.handleError(response));
  }
}
