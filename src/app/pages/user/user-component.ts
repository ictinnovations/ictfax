import { Component, OnInit, ViewChild } from '@angular/core';
import { AUserService } from './user.service';
import { User } from './user';
import { DataSource } from '@angular/cdk/collections';
import { MatSort, MatPaginator } from '@angular/material';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatSortHeaderIntl } from '@angular/material';
import { UserDatabase } from './user-database.component';
import { UserDataSource } from './user-datasource.component';
import { ModalComponent } from '../../modal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ngx-user-component',
  templateUrl: './user-component.html',
  styleUrls: ['./user-component.scss'],
})


export class FormsUserComponent implements OnInit {

  constructor(private user_service: AUserService, private modalService: NgbModal) { }

  aUser: UserDataSource | null;
  length: number;
  closeResult: any;

  displayedColumns= ['ID', 'username', 'first_name', 'last_name', 'email', 'Operations'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
    this.getUserlist();
  }

  getUserlist() {
    this.user_service.get_UserList().then(data => {
      this.length = data.length;
      this.aUser = new  UserDataSource(new UserDatabase( data ), this.sort, this.paginator);
    });
  }


  deleteUser(user_id): void {
    this.user_service.delete_User(user_id)
    .then(response => {
    })
    .catch(this.handleError);
    this.getUserlist();
  }

  // Modal related
  showStaticModal(name, user_id) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      container: 'nb-layout',
    });

    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = `Are you sure you want to delete ${name}?`;
    activeModal.result.then((result) => {
      this.closeResult = result;
      if (this.closeResult === 'yes_click') {
        this.deleteUser(user_id);
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



