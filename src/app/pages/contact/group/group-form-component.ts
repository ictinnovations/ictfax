import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Headers, RequestOptions, Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Group } from './group';
import { GroupService } from './group.service';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import 'rxjs/add/operator/toPromise';
import { AppService } from '../../../app.service';

@Component({
  selector: 'ngx-add-group-component',
  templateUrl: './group-form-component.html',
  styleUrls: ['./group-form-component.scss'],
})

export class AddGroupComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private app_service: AppService, private group_service: GroupService,
  private router: Router) { }

  form1: any= {};
  group: Group= new Group;
  group_id: any= null;
  file: any;
  URL = `${this.app_service.apiUrlGroups}/${this.group_id}/csv`;
  public uploader: FileUploader = new FileUploader({url: this.URL, disableMultipart: true});

  isError = false;
  errorText: any = [];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.group_id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.group_service.get_GroupData(this.group_id).then(data => {
          this.group = data;
        });
      }
    });

    this.uploader.onBeforeUploadItem = (item) => {
      item.method = 'POST';
      item.url = this.URL;
      item.withCredentials = false;
    };

    this.uploader.onAfterAddingFile = (response: any) => {
      this.file = response;
    };

    const authHeader = this.app_service.upload_Header;
    const uploadOptions = <FileUploaderOptions>{headers : authHeader};
    this.uploader.setOptions(uploadOptions);

    this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
    };
  }

  addGroup(): void {
    this.checkFields("new");
    if (this.errorText.length === 0) {
      this.group_service.add_Group(this.group).then(response => {
        const group_id = response;
        this.URL = `${this.app_service.apiUrlGroups}/${group_id}/csv`;
        this.upload();
        this.router.navigate(['../../group'], {relativeTo: this.route});
      });
    }else{
      this.errorHandler(true, this.errorText);
    }
  }

  updateGroup(): void {
    this.checkFields();
    if (this.errorText.length === 0) {
      this.group_service.update_Group(this.group).then(() => {
        this.URL = `${this.app_service.apiUrlGroups}/${this.group_id}/csv`;
        if (this.file != null) {
          this.upload();
        }
        this.router.navigate(['../../group'], {relativeTo: this.route});
      })
      .catch(this.handleError);
    }else{
      this.errorHandler(true, this.errorText);
    }
  }

  upload () {
    this.file.upload();
  }

  private hasBaseDropZoneOver = false;
  private hasAnotherDropZoneOver = false;

  private fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  private fileOverAnother(e: any) {
    this.hasAnotherDropZoneOver = e;
  }

  private checkFields(status = null):any{
    this.errorHandler(false, [])
    if (!this.group.name) this.errorText.push("Group name is required.");
    if (status == "new" && !this.file) this.errorText.push("Contacts CSV file must be selected.");
  }

  private errorHandler(status, message):any{
    this.isError = status;
    this.errorText = message;
    if (status) {
      setTimeout(() => {
        this.isError = false;
        this.errorText = [];
      }, 10000);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
