import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExtensionService } from './extension.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ExtensionDatabase } from './extension-database.component';
import { ExtensionDataSource } from './extension-datasource.component';
import { ModalComponent } from '../../modal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Extension } from './extension';


@Component({
  selector: 'ngx-extension-component',
  templateUrl: './extension-component.html',
  styleUrls: ['./extension-component.scss'],
})

export class FormsExtensionComponent implements OnInit {
  constructor(private extension_service: ExtensionService,
   private dataSourceBuilder: NbTreeGridDataSourceBuilder<Extension>,
   private modalService: NgbModal) { }

  aExtension: Extension[];
  ExtensionDataSource: NbTreeGridDataSource<Extension>;

  length: number;
  closeResult: any;

  items_page = [5, 10, 25, 100];
  pageSize = 10;
  startIndex: number = 0;
  currentPage: number;
  total_pages: number;
  minimumItems: number;
  current_items: any[] = [];

  displayedColumns= ['account_id', 'username', 'phone', 'email', 'Operations'];


  @ViewChild('filter', {static: false}) filter: ElementRef;

  ngOnInit() {
    this.getExtensionlist();
  }

  getExtensionlist() {
    this.extension_service.get_ExtensionList().then(data => {
      this.aExtension = data.sort((a,b) => b.account_id - a.account_id);
      this.length = data.length;
      
      this.paginate(this.pageSize);
      this.ExtensionDataSource = this. dataSourceBuilder.create( this.current_items.map(item => ({ data: item})),);

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
    this.current_items = this.aExtension.slice(this.startIndex, end); 
    this.ExtensionDataSource = this.dataSourceBuilder.create(this.current_items.map(item => ({ data: item })));
  }


  deleteExtension(account_id): void {
    this.extension_service.delete_Extension(account_id)
    .then(response => {
    })
    .catch(this.handleError);
    this.getExtensionlist();
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
        this.deleteExtension(account_id);
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
