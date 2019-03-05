import { NgModule, Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SendFaxService } from './sendfax.service';
import { SendFax } from './sendfax';
import { Response } from '@angular/http';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatSort, MatPaginator } from '@angular/material';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatSortHeaderIntl } from '@angular/material';
import { SendFaxDatabase } from './sendfax-database.component';
import { SendFaxDataSource } from './sendfax-datasource.component';


import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { error } from 'util';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { elementAt } from 'rxjs/operator/elementAt';


@Component({
  selector: 'ngx-sendfax-component',
  templateUrl: './sendfax-component.html',
  styleUrls: ['./sendfax-component.scss'],
})

export class FormsSendFaxComponent implements OnInit {
  constructor(private sendfax_service: SendFaxService) { }

  aSendFax: SendFaxDataSource | null;
  public length: number;

  displayedColumns= ['ID', 'contact_id', 'status'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
    this.getFaxlist();
  }

  getFaxlist() {
    this.sendfax_service.get_OutFaxTransmissionList().then(data => {
      this.length = data.length;
      this.aSendFax = new SendFaxDataSource(new SendFaxDatabase( data ), this.sort, this.paginator);
    });
  }
}
