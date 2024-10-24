import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DIDService } from './did.service';
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

  items_page = [5, 10, 25, 100];
  pageSize = 10;
  startIndex: number = 0;
  currentPage: number;
  total_pages: number;
  minimumItems: number;
  current_items: any[] = [];

  displayedColumns= ['phone', 'first_name', 'Operations'];


  @ViewChild('filter', {static: false}) filter: ElementRef;


  ngOnInit() {
    this.getDIDlist();
  }

  getDIDlist() {
    this.did_service.get_DIDList().then(data => {
      this.aDID = data.sort((a,b) => b.account_id - a.account_id);
      this.length = data.length;

      this.paginate(this.pageSize);
      this.DIDDataSource = this.dataSourceBuilder.create(this.current_items.map(item => ({ data: item })),);

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
    this.current_items = this.aDID.slice(this.startIndex, end); 
    this.DIDDataSource = this.dataSourceBuilder.create(this.current_items.map(item => ({ data: item })));
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
