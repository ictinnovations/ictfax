import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DIDService } from './did.service';
import {MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DIDDatabase } from './did-database.component';
import { DIDDataSource } from './did-datasource.component';
import { ModalComponent } from '../../modal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { DID } from './did';
@Component({
  selector: 'ngx-did-component',
  templateUrl: './did-component.html',
  styleUrls: ['./did-component.scss'],
})


export class FormsDIDComponent implements OnInit {
  constructor(private did_service: DIDService,
  private dataSourceBuilder: NbTreeGridDataSourceBuilder<DID>,
  private modalService: NgbModal) { }

  aDID: DID[];
  DIDDataSource: NbTreeGridDataSource<DID>;

  length: number;
  closeResult: any;

  displayedColumns= ['phone', 'first_name', 'Operations'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild('filter', {static: false}) filter: ElementRef;


  ngOnInit() {
    this.getDIDlist();
  }

  getDIDlist() {
    this.did_service.get_DIDList().then(data => {
      this.aDID = data;
      this.length = data.length;

      this.DIDDataSource = this.dataSourceBuilder.create(this.aDID.map(item => ({ data: item })),);

    });
  }


  deleteDID(account_id): void {
    this.did_service.delete_DID(account_id)
    .then(response => {
    })
    .catch(this.handleError);
    this.getDIDlist();
  }

  // Modal related
  showStaticModal(name, account_id) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      container: 'nb-layout',
    });

    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = `Are you sure you want to delete ${name}?`;
    activeModal.result.then((result) => {
      this.closeResult = result;
      if (this.closeResult === 'yes_click') {
        this.deleteDID(account_id);
      }
    }, (reason) => {
      this.closeResult = this.getDismissReason(reason);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
