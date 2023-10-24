import { Component, OnInit, ViewChild } from '@angular/core';
import { IncomingCIDNumberService } from './incoming_cid_number.service';
import { IncomingCIDNumber } from './incoming_cid_number';
import { DataSource } from '@angular/cdk/collections';
import { MatSort  } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatSortHeaderIntl } from '@angular/material/sort';
import { IncomingCIDNumberDatabase } from './incoming_cid_number-database.component';
import { IncomingCIDNumberDataSource } from './incoming_cid_number-datasource.component';
import { CIDDatabase } from '../cid/cid-database.component';
import { CIDDataSource } from '../cid/cid-datasource.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modal.component';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { CIDService } from '../cid/cid.service';
import { AUserService } from '../user/user.service';
import { User } from '../user/user';

@Component({
  selector: 'ngx-incomingnumber-component',
  templateUrl: './incoming_cid_number-component.html',
  styleUrls: ['./incoming_cid_number-component.scss'],
})


export class FormsIncomingCIDNumberComponent implements OnInit {

  auser: any;

  constructor(private in_number_service: IncomingCIDNumberService, private authService: NbAuthService
  , private did_service: CIDService, private user_service: AUserService) {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken,
    ) => {
      if (token && token.getValue()) {
        this.auser = token.getPayload();
      }
    });
  }

  aCID: CIDDataSource | null;
  aNumbers: IncomingCIDNumberDataSource | null;
  length: number;
  closeResult: any;
  data: [];
  users: User[] = [];

  displayedColumns= ['phone', 'first_name', 'assigned_to', 'forward_to', 'Operations'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    if (this.auser.is_admin == 0) {
      this.getIncomingNumberlist();
    } else {
      this.getAllList();
    }
  }

  getIncomingNumberlist() {
    this.in_number_service.get_List(this.auser.user_id).then(data => {
      this.length = data.length;
      this.data = data;
      this.aNumbers = new IncomingCIDNumberDataSource(new IncomingCIDNumberDatabase( data ), this.sort, this.paginator);      this.getUserlist();
      this.getUserlist();
    })
    .catch(this.handleError);
  }

  getAllList() {
    this.did_service.get_CIDList().then(response => {
      this.length = response.length;
      this.data = response;
      this.aNumbers = new IncomingCIDNumberDataSource(new IncomingCIDNumberDatabase( response ), this.sort, this.paginator);
      this.getUserlist();
    });
  }

  getUserlist() {
    this.user_service.get_UserList().then(response => {
      this.users = response;
      this.getUsername(this.data);
    })
  }

  getUsername(data) {
    let requests = data.map((item) => {
      return new Promise((resolve) => {
        let foundelemet = this.users.find(x => x.user_id === item.created_by);
        item.name = foundelemet ? foundelemet.username : null;
        console.log(item);

        this.asyncFunction(item, resolve);
      });
    })

    Promise.all(requests).then(() => {
      this.aCID = new CIDDataSource(new CIDDatabase( data ), this.sort, this.paginator);
    });
  }

  asyncFunction (item, cb) {
    setTimeout(() => {
      // console.log('done with', item);
      cb();
    }, 300);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
