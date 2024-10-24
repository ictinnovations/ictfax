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

  items_page = [5, 10, 25, 100];
  pageSize = 10;
  startIndex: number = 0;
  currentPage: number;
  total_pages: number;
  minimumItems: number;
  current_items: any[] = [];


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
      this.aNumbers = response;
      this.length = response.length;
      this.paginate(this.pageSize);
      this.IncomingNumberDataSource = this.IncomingNumberdataSourceBuilder.create(response.map(item => ({ data: item })));
    }).catch(error => {
      console.error('Error fetching DID List:', error);
    });
  }

  paginate(page_Items: string | number) {
    if (!this.aNumbers || this.aNumbers.length === 0) {
      return; 
    }
    if (typeof page_Items === 'string') {
      if (page_Items === 'next') {
        if (this.startIndex + this.pageSize < this.length) {
          this.startIndex += this.pageSize; 
        }
      } else if (page_Items === 'previous') {
        if (this.startIndex > 0) {
          this.startIndex -= this.pageSize;
        }
      }
    } else {
      this.pageSize = page_Items;
      this.startIndex = 0; 
    }
    this.currentPage = Math.floor(this.startIndex / this.pageSize) + 1;
    this.total_pages = Math.ceil(this.length / this.pageSize);
    this.minimumItems = Math.min(this.startIndex + this.pageSize, this.length);    
    
    const end = Math.min(this.startIndex + this.pageSize, this.length);
    this.current_items = this.aNumbers.slice(this.startIndex, end); 
    this.IncomingNumberDataSource = this.IncomingNumberdataSourceBuilder.create(this.current_items.map(item => ({ data: item })));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
