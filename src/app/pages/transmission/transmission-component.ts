import { NgModule, Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TransmissionService } from './transmission.service';
import { Transmission, Program } from './transmission';
import { Response } from '@angular/http';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatSort, MatPaginator } from '@angular/material';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatSortHeaderIntl } from '@angular/material';
import { TransmissionDatabase } from './transmission-database.component';
import { TransmissionDataSource } from './transmission-datasource.component';


import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { error } from 'util';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { elementAt } from 'rxjs/operator/elementAt';


@Component({
  selector: 'ngx-transmission-component',
  templateUrl: './transmission-component.html',
  styleUrls: ['./transmission-component.scss'],
})

export class FormsTransmissionComponent implements OnInit {
  constructor(private transmission_service: TransmissionService) { }

  aTransmission: TransmissionDataSource | null;
  public showSelected: boolean;
  public length: number;
  public abc: any;
  public def: any;
  public err_code: string;
  public err_message: string;
  public appval;

  displayedColumns= ['ID', 'contact_id', 'status'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
    this.getTransmissionlist();
  }

  getTransmissionlist() {
    this.transmission_service.get_OutFaxTransmissionList().then(data => {
      this.length = data.length;
      this.aTransmission = new TransmissionDataSource(new TransmissionDatabase( data ), this.sort, this.paginator);
    });
  }
}
