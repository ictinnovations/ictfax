import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AUserService } from './user.service';
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
  
  items_page = [5, 10, 25, 100];
  pageSize = 10;
  startIndex: number = 0;
  currentPage: number;
  total_pages: number;
  minimumItems: number;
  current_items: any[] = [];

  displayedColumns= ['user_id', 'username', 'first_name', 'last_name', 'email', 'Operations'];


  @ViewChild('filter', {static: false}) filter: ElementRef;

  ngOnInit() {
    this.getUserlist();
  }

  getUserlist() {
    this.user_service.get_UserList().then(data => {
      this.aUser = data.sort((a, b) => b.user_id - a.user_id);
      this.length = data.length;

      this.paginate(this.pageSize);
      this.UserDataSource = this.dataSourceBuilder.create(this.current_items.map(item => ({ data: item })),);

    });
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
    this.current_items = this.aUser.slice(this.startIndex, end); 
    this.UserDataSource = this.dataSourceBuilder.create(this.current_items.map(item => ({ data: item })));
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



