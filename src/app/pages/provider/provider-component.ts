import { Component, OnInit, ViewChild, ElementRef, Provider } from '@angular/core';
import { ProviderService } from './provider.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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

  aProvider: Provider[];
  ProviderDataSource: NbTreeGridDataSource<Provider>;

  length: number;
  closeResult: any;

  displayedColumns= ['ID', 'Name', 'host', 'type', 'Operations'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild('filter', {static: false}) filter: ElementRef;

  ngOnInit() {
    this.getProviderlist();
  }

  getProviderlist() {
    this.provider_service.get_ProviderList().then(data => {
      // this.aProvider = data;
      this.length = data.length;

      this.ProviderDataSource = this.dataSourceBulider.create(this.aProvider.map(item => ({ data: item })));

      // Observable for the filter
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
     .debounceTime(150)
     .distinctUntilChanged()
     .subscribe(() => {
       if (!this.aProvider) { return; }
       this.aProvider.filter = this.filter.nativeElement.value;
      });
    })
    .catch(this.handleError);
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
