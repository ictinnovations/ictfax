import { Component, OnInit, ViewChild } from '@angular/core';
import { ExtensionService } from './extension.service';
import { Extension } from './extension';
import { DataSource } from '@angular/cdk/collections';
import { MatSort, MatPaginator } from '@angular/material';
import { ExtensionDatabase } from './extension-database.component';
import { ExtensionDataSource } from './extension-datasource.component';
import { ModalComponent } from '../../modal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-extension-component',
  templateUrl: './extension-component.html',
  styleUrls: ['./extension-component.scss'],
})

export class FormsExtensionComponent implements OnInit {
  constructor(private extension_service: ExtensionService, private modalService: NgbModal) { }

  aExtension: ExtensionDataSource | null;
  length: number;
  closeResult: any;

  displayedColumns= ['ID', 'username', 'phone', 'email', 'Operations'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
    this.getExtensionlist();
  }

  getExtensionlist() {
    this.extension_service.get_ExtensionList().then(data => {
      this.length = data.length;
      this.aExtension = new  ExtensionDataSource(new ExtensionDatabase( data ), this.sort, this.paginator);
    });
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
