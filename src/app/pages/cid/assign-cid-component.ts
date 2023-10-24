import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import 'rxjs/add/operator/toPromise';

import { CID } from './cid';
import { CIDService } from './cid.service';
import { User } from '../user/user';
import { AUserService } from '../user/user.service';

@Component({
  selector: 'ngx-assign-cid-component',
  templateUrl: './assign-cid-component.html',
  styleUrls: ['./assign-cid-component.scss'],
})

export class AssignCIDComponent implements OnInit {

  constructor(private route: ActivatedRoute, private cid_service: CIDService,
  private router: Router, private user_service: AUserService) { }

  cid: CID = new CID;
  form1: any= {};
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
        return this.cid_service.get_CIDData(this.id).then(data => {
          this.cid = data;
        });
      }
    });
  }

  getUserList() {
    this.user_service.get_UserList().then(data => {
      this.user = data;
    });
  }

  forwardDID(): void {
    this.cid_service.unassign_CID(this.cid).then(response => {
      this.cid_service.assign_CID(this.cid).then(data => {
        this.router.navigate(['../../../cid'], {relativeTo: this.route});
      });
    });
  }


  get selectedUsr() {
    return this.selectedUser;
  }

  set selectedUsr(value) {
    this.selectedUser = value;
    this.cid.user_id = this.selectedUser.user_id;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
