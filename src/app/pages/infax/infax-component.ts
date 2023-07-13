import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { Headers, RequestOptions, Http } from '@angular/http';
import { Transmission } from '../transmission/transmission';
import { InFaxService } from './infax.service';
import { MatSort,Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { InFaxDataSource } from './infax-datasource.component';
import { InFaxDatabase } from './infax-database.component';
import { DocumentService } from '../message/document/document.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'ngx-infax-component',
  templateUrl: './infax-component.html',
  styleUrls: ['./infax-component.scss'],
})

export class InFaxComponent implements OnInit {

  constructor(private router: Router, private infax_service: InFaxService, private document_service: DocumentService
  ,private app_service: AppService, private http: Http) { }

  aInFax: InFaxDataSource | null;
  length: number;
  document_id:any;

  displayedColumns= ['ID', 'phone', 'status', 'Timestamp', 'Operations'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild('filter', {static: false}) filter: ElementRef;


  ngOnInit() {
    this.getInFaxList();
  }

  getInFaxList() {
    this.infax_service.get_InFaxTransmissionList().then(data => {
      this.length = data.length;

      data.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      })

      this.aInFax = new InFaxDataSource(new InFaxDatabase( data ), this.sort, this.paginator);

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
       if (!this.aInFax) { return; }
       this.aInFax.filter = this.filter.nativeElement.value;
      });
    });
  }

  downloadDocument(transmission_id) {
    this.infax_service.getTransmissionResult(transmission_id).then(response =>  {
      this.document_id = response[0].data;
      this.document_service.get_Documentdownload(this.document_id);
    });
  }

  async get_ContactData(contact_id) {
    const headers = new Headers();
    this.app_service.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers});
    const url5 = `${this.app_service.apiUrlContacts}/${contact_id}`;
    return await this.http.get(url5, options).toPromise().then(response => response.json())
    .catch(err => this.app_service.handleError(err));
  }
}
