import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderService } from './provider.service';
import { Provider } from './provider';
import { DataSource } from '@angular/cdk/collections';
import { MatSort, MatPaginator } from '@angular/material';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatSortHeaderIntl } from '@angular/material';
import { ProviderDatabase } from './provider-database.component';
import { ProviderDataSource } from './provider-datasource.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modal.component';

@Component({
  selector: 'ngx-provider-component',
  templateUrl: './provider-component.html',
  styleUrls: ['./provider-component.scss'],
})


export class FormsProviderComponent implements OnInit {
  constructor(private provider_service: ProviderService, private modalService: NgbModal) { }

  aProvider: ProviderDataSource | null;
  length: number;
  closeResult: any;

  displayedColumns= ['ID', 'Name', 'host', 'type', 'Operations'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getProviderlist();
  }

  getProviderlist() {
    this.provider_service.get_ProviderList().then(data => {
      this.length = data.length;
      this.aProvider = new ProviderDataSource(new ProviderDatabase( data ), this.sort, this.paginator);
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
