import { NgModule, Component, EventEmitter, ElementRef, Input, Output, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SendFaxService } from './sendfax.service';
import { SendFax } from './sendfax';
import { Response, Http, RequestOptions, Headers } from '@angular/http';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatSort, MatPaginator, Sort } from '@angular/material';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatSortHeaderIntl } from '@angular/material';
import { SendFaxDatabase } from './sendfax-database.component';
import { SendFaxDataSource } from './sendfax-datasource.component';
import { ContactService } from '../contact/contact.service';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import { AppService } from '../../app.service';
import { TransmissionService } from '../transmission/transmission.service';


@Component({
  selector: 'ngx-sendfax-component',
  templateUrl: './sendfax-component.html',
  styleUrls: ['./sendfax-component.scss'],
})

export class FormsSendFaxComponent implements OnInit {
  constructor(private sendfax_service: SendFaxService, private contact_service: ContactService, private http: Http
  ,private app_service: AppService) { }

  aSendFax: SendFaxDataSource | null;
  public length: number;

  private timerSubscription: any;

  displayedColumns= ['ID', 'phone', 'Timestamp', 'username', 'status'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild('filter', {static: false}) filter: ElementRef;


  ngOnInit() {
    this.getFaxlist();
    
    setTimeout(() => {
      this.refreshData();
    }, 8000);
    
  }

  async getFaxlist() {
    this.sendfax_service.get_OutFaxTransmissionList().then(data => {
      this.length = data.length;

      data.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      })
      
      this.aSendFax = new SendFaxDataSource(new SendFaxDatabase( data ), this.sort, this.paginator);

      //Sort the data automatically

      const sortState: Sort = {active: 'ID', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);

      // Observable for the filter
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
     .debounceTime(150)
     .distinctUntilChanged()
     .subscribe(() => {
       if (!this.aSendFax) { return; }
       this.aSendFax.filter = this.filter.nativeElement.value;
      });
    });
  }

  private refreshData(): void {
    this.sendfax_service.get_OutFaxTransmissionList().then(data => {
      this.length = data.length;

      data.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      })
      
      this.aSendFax = new SendFaxDataSource(new SendFaxDatabase( data ), this.sort, this.paginator);

      // Observable for the filter
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
     .debounceTime(150)
     .distinctUntilChanged()
     .subscribe(() => {
       if (!this.aSendFax) { return; }
       this.aSendFax.filter = this.filter.nativeElement.value;
      });
    });
    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.timerSubscription = Observable.timer(5000).first().subscribe(() => this.refreshData());
  }


}
