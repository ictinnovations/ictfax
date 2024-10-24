import { Component, OnInit, ViewChild, ElementRef, Provider } from '@angular/core';
import { ProviderService } from './provider.service';
import { ProviderDatabase } from './provider-database.component';
import { ProviderDataSource } from './provider-datasource.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modal.component';
import { Observable } from 'rxjs/Rx';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

@Component({
  selector: 'ngx-provider-component',
  templateUrl: './provider-component.html',
  styleUrls: ['./provider-component.scss'],
})


export class FormsProviderComponent implements OnInit {
  constructor(private provider_service: ProviderService,
    private dataSourceBulider:  NbTreeGridDataSourceBuilder<Provider>,
    private modalService: NgbModal) { }

  aProvider: any[] = [];
  ProviderDataSource: NbTreeGridDataSource<Provider>;

  length: number;
  closeResult: any;

  items_page = [5, 10, 25, 100];
  pageSize = 10;
  startIndex: number = 0;
  currentPage: number;
  total_pages: number;
  minimumItems: number;
  current_items: any[] = [];

  displayedColumns= ['provider_id', 'name', 'host', 'type', 'Operations'];


  @ViewChild('filter', {static: false}) filter: ElementRef;

  ngOnInit() {
    this.getProviderlist();
  }

  getProviderlist() {
    this.provider_service.get_ProviderList().then(data => {
      this.aProvider = data.sort((a, b) => b.provider_id - a.provider_id);
      this.length = data.length;
      this.paginate(this.pageSize);
      this.ProviderDataSource = this.dataSourceBulider.create(this.current_items.map(item => ({ data: item })));

    })
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
    this.current_items = this.aProvider.slice(this.startIndex, end);
    this.ProviderDataSource = this.dataSourceBulider.create(this.current_items.map(item => ({ data: item })));
  }






  deleteProvider(provider_id): void {
    this.provider_service.delete_Provider(provider_id).then(response => {
    })
    .catch(this.handleError);
    this.getProviderlist();
  }

  // Modal related
  showStaticModal(name, provider_id) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      container: 'nb-layout',
    });

    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = `Are you sure you want to delete ${name}?`;
    activeModal.result.then((result) => {
      this.closeResult = result;
      if (this.closeResult === 'yes_click') {
        this.deleteProvider(provider_id);
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
