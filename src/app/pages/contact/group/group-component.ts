import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GroupService } from './group.service';
import {  MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { GroupDatabase } from './group-database.component';
import { GroupDataSource } from './group-datasource.component';
import { ModalComponent } from '../../../modal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'ngx-group-component',
  templateUrl: './group-component.html',
  styleUrls: ['./group-component.scss'],
})


export class FormsGroupComponent implements OnInit {

  constructor(private group_service: GroupService, private modalService: NgbModal) { }

  aGroup: GroupDataSource | null;
  length: number;
  closeResult: any;

  displayedColumns= ['ID', 'Name', 'contact_total', 'Operations'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.getGrouplist();
  }

  getGrouplist() {
    this.group_service.get_GroupList().then(data => {
      this.length = data.length;
      this.aGroup = new GroupDataSource(new GroupDatabase( data ), this.sort, this.paginator);

      // Observable for the filter
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
     .debounceTime(150)
     .distinctUntilChanged()
     .subscribe(() => {
       if (!this.aGroup) { return; }
       this.aGroup.filter = this.filter.nativeElement.value;
      });

      //Sort the data automatically

      const sortState: Sort = {active: 'ID', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    });
  }


  deleteGroup(group_id): void {
    this.group_service.delete_Group(group_id).then(response => {
    })
    .catch(this.handleError);
    this.getGrouplist();
  }

  // Modal related
  showStaticModal(name, group_id) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      container: 'nb-layout',
    });

    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = `Are you sure you want to delete ${name}?`;
    activeModal.result.then((result) => {
      this.closeResult = result;
      if (this.closeResult === 'yes_click') {
        this.deleteGroup(group_id);
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

  sampleCSV(): void {
    this.group_service.getSampleCSV();
  }

  getCSV(group_id) {
    this.group_service.getContactCSV(group_id);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
