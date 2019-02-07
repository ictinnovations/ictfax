import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { Transmission } from '../transmission/transmission';
import { InFaxService } from './infax.service';
import { MatSort, MatPaginator } from '@angular/material';
import { InFaxDataSource } from './infax-datasource.component';
import { InFaxDatabase } from './infax-database.component';
import { DocumentService } from '../message/document/document.service';

@Component({
  selector: 'ngx-infax-component',
  templateUrl: './infax-component.html',
  styleUrls: ['./infax-component.scss'],
})

export class InFaxComponent implements OnInit {

  constructor(private router: Router, private infax_service: InFaxService, private document_service: DocumentService) { }

  aInFax: InFaxDataSource | null;
  length: number;
  document_id:any;

  displayedColumns= ['ID', 'status', 'Operations'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getInFaxList();
  }

  getInFaxList() {
    this.infax_service.get_InFaxTransmissionList().then(data => {
      this.length = data.length;
      this.aInFax = new InFaxDataSource(new InFaxDatabase( data ), this.sort, this.paginator);
    });
  }

  downloadDocument(transmission_id) {
    this.infax_service.getTransmissionResult(transmission_id).then(response =>  {
      this.document_id = response[0].data;
      this.document_service.get_Documentdownload(this.document_id);
    });
  }
}
