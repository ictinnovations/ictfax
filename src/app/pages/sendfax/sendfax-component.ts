import { NgModule, Component, EventEmitter, ElementRef, Input, Output, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SendFaxService } from './sendfax.service';
import { SendFax } from './sendfax';
import { Response, Http, RequestOptions, Headers } from '@angular/http';
import { ContactService } from '../contact/contact.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import { AppService } from '../../app.service';
import { TransmissionService } from '../transmission/transmission.service';
import { DocumentService } from '../message/document/document.service';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';


@Component({
  selector: 'ngx-sendfax-component',
  templateUrl: './sendfax-component.html',
  styleUrls: ['./sendfax-component.scss'],
})

export class FormsSendFaxComponent implements OnInit {
  constructor(private sendfax_service: SendFaxService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<SendFax>,
    private contact_service: ContactService, private http: Http,
    private app_service: AppService, private documnet_service:DocumentService) { }
  

  aSendFax: SendFax[];
  SendFaxDataSource: NbTreeGridDataSource<SendFax>;

  public length: number;

  private timerSubscription: any;

  items_page = [5, 10, 25, 100];
  pageSize = 10;
  startIndex: number = 0;
  currentPage: number;
  total_pages: number;
  minimumItems: number;
  current_items: any[] = [];

  displayedColumns= ['transmission_id', 'phone', 'Timestamp', 'username','status', 'Operations'];




  @ViewChild('filter', {static: false}) filter: ElementRef;


  ngOnInit() {
    this.getFaxlist();

    setTimeout(() => {
      this.refreshData();
    }, 8000);

  }

  async getFaxlist() {
    this.sendfax_service.get_OutFaxTransmissionList().then(data => {
      this.aSendFax = data.sort((a, b) => b.transmission_id - a.transmission_id);
      this.length = data.length;

      data.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      })
      this.SendFaxDataSource = this.dataSourceBuilder.create(data.map(item => ({ data: item })),);
    });
  }

  private refreshData(): void {
    this.sendfax_service.get_OutFaxTransmissionList().then(data => {
      this.aSendFax = data.sort((a, b) => b.transmission_id - a.transmission_id);
      this.length = data.length;

      data.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      })
      this.paginate(this.pageSize);
      this.SendFaxDataSource = this.dataSourceBuilder.create(this.current_items.map(item => ({ data: item })));
    });
    this.subscribeToData();
  }

  paginate(page_Items: string | number) {
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
    this.current_items = this.aSendFax.slice(this.startIndex, end); 
    this.SendFaxDataSource = this.dataSourceBuilder.create(this.current_items.map(item => ({ data: item })));
  }
  
  downloadDocument(document_id){
    this.documnet_service.get_Documentdownload(document_id);
  }
  deleteDocument(transmission_id){
this.sendfax_service.delete_Document(transmission_id)
  }

  private subscribeToData(): void {
    this.timerSubscription = Observable.timer(5000).first().subscribe(() => this.refreshData());
  }


}
