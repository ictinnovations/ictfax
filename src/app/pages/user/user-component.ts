import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AUserService } from './user.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UserDatabase } from './user-database.component';
import { UserDataSource } from './user-datasource.component';
import { ModalComponent } from '../../modal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { User } from './user';


@Component({
  selector: 'ngx-user-component',
  templateUrl: './user-component.html',
  styleUrls: ['./user-component.scss'],
})


export class FormsUserComponent implements OnInit {

  constructor(private user_service: AUserService,
  private dataSourceBuilder: NbTreeGridDataSourceBuilder<User>,
  private modalService: NgbModal) { }

  aUser: User[];
  UserDataSource: NbTreeGridDataSource<User>;

  length: number;
  closeResult: any;

  displayedColumns= ['ID', 'username', 'first_name', 'last_name', 'email', 'Operations'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild('filter', {static: false}) filter: ElementRef;

  ngOnInit() {
    this.getUserlist();
  }

  getUserlist() {
    this.user_service.get_UserList().then(data => {
      this.aUser = data as User[];
      this.length = data.length;
      this.UserDataSource = this.dataSourceBuilder.create(this.aUser.map(item => ({ data: item })),);

      //Sort the data automatically

      const sortState: Sort = {active: 'ID', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);

      // Observable for the filter
      fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(debounceTime(150),
      distinctUntilChanged())
     .subscribe(() => {
       if (!this.aUser) { return; }
       this.aUser.filter = this.filter.nativeElement.value;
      });
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
  showStaticModal(user_id) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      container: 'nb-layout',
    });

    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = `Are you sure you want to delete ${user_id}?`;
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



