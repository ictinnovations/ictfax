import { Component, OnInit, ViewChild } from '@angular/core';
import { IncomingNumberService } from './incoming_number.service';
import { IncomingNumber } from './incoming_number';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { IncomingNumberDatabase } from './incoming_number-database.component';
import { IncomingNumberDataSource } from './incoming_number-datasource.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modal.component';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { DIDService } from '../did/did.service';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { User } from '../user/user';

@Component({
  selector: 'ngx-incomingnumber-component',
  templateUrl: './incoming_number-component.html',
  styleUrls: ['./incoming_number-component.scss'],
})


export class FormsIncomingNumberComponent implements OnInit {

  auser: any;

  constructor(private in_number_service: IncomingNumberService,
    private IncomingNumberdataSourceBuilder: NbTreeGridDataSourceBuilder<Number>,
    private authService: NbAuthService
  , private did_service: DIDService) {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken,
    ) => {
      if (token && token.getValue()) {
        this.auser = token.getPayload();
      }
    });
  }

  aNumbers: Number[];
  IncomingNumberDataSource: NbTreeGridDataSource<Number>;

  length: number;
  closeResult: any;

  displayedColumns= ['phone', 'first_name', 'Operations'];

  @ViewChild(MatSort, { static: false}) sort: MatSort;

  @ViewChild(MatPaginator, { static: false}) paginator: MatPaginator;

  ngOnInit() {
    if (this.auser.is_admin == 0) {
      this.getIncomingNumberlist();
    } else {
      this.getAllList();
    }
  }

  getIncomingNumberlist() {
    this.in_number_service.get_List(this.auser.user_id).then(data => {
      this.aNumbers = data;
      this.length = data.length;
      this.IncomingNumberDataSource = this.IncomingNumberdataSourceBuilder.create(data.map(item => ({ data: item})));

    })
    .catch(this.handleError);
  }

  getAllList() {
    this.did_service.get_DIDList().then(response => {
      this.length = response.length;
      this.IncomingNumberDataSource = this.IncomingNumberdataSourceBuilder.create(response.map(item => ({ data: item})));
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
