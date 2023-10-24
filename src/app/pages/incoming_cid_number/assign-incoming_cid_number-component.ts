import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { IncomingCIDNumber } from './incoming_cid_number';
import { IncomingCIDNumberService } from './incoming_cid_number.service';
import { CID } from '../cid/cid';
import { CIDService } from '../cid/cid.service';
import 'rxjs/add/operator/toPromise';
import { User } from '../user/user';
import { AUserService } from '../user/user.service';

@Component({
  selector: 'ngx-assign-incoming-component',
  templateUrl: './assign-incoming_cid_number-component.html',
  styleUrls: ['./assign-incoming_cid_number-component.scss'],
})

export class AssignIncomingCIDNumberComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private in_number_service: IncomingCIDNumberService,
  private router: Router, private user_service: AUserService, private cid_service: CIDService) { }

  cid: CID = new CID;
  form1: any= {};
  incomingNumber: IncomingCIDNumber= new IncomingCIDNumber;
  id: any= null;
  user: User[] = [];
  selectedUser: User;

  ngOnInit(): void {
    this.getUserList();
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.in_number_service.get_Data(this.id).then(data => {
          this.incomingNumber = data;
        });
      }
    });
  }

  getUserList() {
    this.user_service.get_UserList().then(data => {
      this.user = data;
    });
  }

  get selectedUsr() {
    return this.selectedUser;
  }

  set selectedUsr(value) {
    this.selectedUser = value;
    this.incomingNumber.user_id = this.selectedUser.user_id;
  }

  forwardDID(): void {
    this.cid_service.unassign_CID(this.incomingNumber).then(response => {
      this.cid_service.assign_CID(this.incomingNumber).then(data => {
        this.router.navigate(['../../../incoming_number'], {relativeTo: this.route});
      });
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
