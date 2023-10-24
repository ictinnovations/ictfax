import { Component, OnInit, ViewChild } from '@angular/core';
import { CIDService } from './cid.service';
import { CID } from './cid';
import { DataSource } from '@angular/cdk/collections';
import {  MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CIDDatabase } from './cid-database.component';
import { CIDDataSource } from './cid-datasource.component';
import { ModalComponent } from '../../modal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AUserService } from '../user/user.service';
import { User } from '../user/user';

@Component({
  selector: 'ngx-cid-component',
  templateUrl: './cid-component.html',
  styleUrls: ['./cid-component.scss'],
})


export class FormsCIDComponent implements OnInit {
  constructor(private cid_service: CIDService, private modalService: NgbModal, private user_service: AUserService) { }

  aCID: CIDDataSource | null;
  length: number;
  closeResult: any;
  data: [];

  users: User[] = [];

  displayedColumns= ['phone', 'first_name', 'assigned_to', 'Operations'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
    this.getCIDlist();
  }

  getCIDlist() {
    this.cid_service.get_CIDList().then(data => {
      this.length = data.length;
      this.data = data;
      this.getUserlist();
    });
  }

  getUserlist() {
    this.user_service.get_UserList().then(response => {
      this.users = response;
      this.getUsername(this.data);
    })
  }

  getUsername(data) {

    let requests = data.map((item) => {
      return new Promise((resolve) => {
        let foundelemet = this.users.find(x => x.user_id === item.created_by);
        item.name = foundelemet ? foundelemet.username : null;
        this.asyncFunction(item, resolve);
      });
    })
  
    Promise.all(requests).then(() => {
      this.aCID = new CIDDataSource(new CIDDatabase( data ), this.sort, this.paginator);
    });
  }

  asyncFunction (item, cb) {
    setTimeout(() => {
      // console.log('done with', item);
      cb();
    }, 300);
  }

  deleteCID(account_id): void {
    this.cid_service.delete_CID(account_id)
    .then(response => {
    })
    .catch(this.handleError);
    this.getCIDlist();
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
        this.deleteCID(account_id);
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
