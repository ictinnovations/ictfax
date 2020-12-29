import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Campaign, DocumentProgram } from '../campaign';
import { CampaignService } from '../campaign.service';
import { Document } from '../../message/document/document';
import { DocumentService } from '../../message/document/document.service';
import { Group } from '../../contact/group/group';
import { GroupService } from '../../contact/group/group.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'ngx-add-campaign-component',
  templateUrl: './campaign-document-component.html',
  styleUrls: ['./campaign-document-component.scss'],
})

export class AddDocCampaignComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private document_service: DocumentService, private group_service: GroupService, private campaign_service: CampaignService, private router: Router) { }


  form1: any= {};
  documentProgram: DocumentProgram = new DocumentProgram;
  campaign: Campaign= new Campaign;
  campaign_id: any= null;
  group: Group[] = [];
  selectedGroup: Group;
  document: Document[] = [];
  selectedDocument: Document;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.campaign_id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.campaign_service.get_CampaignData(this.campaign_id).then(data => {
          this.campaign = data;
        });
      }
    });
    this.getDocumentlist();
    this.getGrouplist();
  }

  addSendDocument(): void {
    this.campaign_service.add_senddocument(this.documentProgram).then(response => {
      const program_id = response;
      this.campaign.program_id = program_id;
      this.addCampaign();
    });
  }


  addCampaign(): void {
    this.campaign_service.add_Campaign(this.campaign).then(response => {
      this.router.navigate(['../../../campaigns'], {relativeTo: this.route});
    });
  }

  updateCampaign(): void {
    this.campaign_service.add_senddocument(this.documentProgram).then(response => {
      const program_id = response;
      this.campaign.program_id = program_id;
      this.update();
      this.router.navigate(['../../../campaigns'], {relativeTo: this.route});
    });
  }


  update(): void {
    this.campaign_service.update_Campaign(this.campaign).then(() => {
    })
    .catch(this.handleError);
  }

  getDocumentlist() {
    this.document_service.get_DocumentList().then(data => {
      this.document = data;
    });
  }

  get selectedDoc() {
    return this.selectedDocument;
  }

  set selectedDoc(value) {
    this.selectedDocument = value;
    this.documentProgram.document_id = this.selectedDocument.document_id;
  }


  getGrouplist() {
    this.group_service.get_GroupList().then(data => {
      this.group = data;
    });
  }

  get selectedGrp() {
    return this.selectedGroup;
  }

  set selectedGrp(value) {
    this.selectedGroup = value;
    this.campaign.group_id = this.selectedGroup.group_id;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}