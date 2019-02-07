import { Component, OnInit, ViewChild } from '@angular/core';
import { IncomingNumberService } from './incoming_number.service';
import { IncomingNumber } from './incoming_number';
import { DataSource } from '@angular/cdk/collections';
import { MatSort, MatPaginator } from '@angular/material';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatSortHeaderIntl } from '@angular/material';
import { IncomingNumberDatabase } from './incoming_number-database.component';
import { IncomingNumberDataSource } from './incoming_number-datasource.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modal.component';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { DIDService } from '../did/did.service';

@Component({
  selector: 'ngx-incomingnumber-component',
  templateUrl: './incoming_number-component.html',
  styleUrls: ['./incoming_number-component.scss'],
})


export class FormsIncomingNumberComponent implements OnInit {

  auser: any;

  constructor(private in_number_service: IncomingNumberService, private authService: NbAuthService
  , private did_service: DIDService) {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken,
    ) => {
      if (token && token.getValue()) {
        this.auser = token.getPayload();
      }
    });
  }

  aNumbers: IncomingNumberDataSource | null;
  length: number;
  closeResult: any;

  displayedColumns= ['phone', 'first_name', 'Operations'];

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
      this.aNumbers = new IncomingNumberDataSource(new IncomingNumberDatabase( data ), this.sort, this.paginator);
    })
    .catch(this.handleError);
  }

  getAllList() {
    this.did_service.get_DIDList().then(response => {
      this.length = response.length;
      this.aNumbers = new IncomingNumberDataSource(new IncomingNumberDatabase( response ), this.sort, this.paginator);
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
