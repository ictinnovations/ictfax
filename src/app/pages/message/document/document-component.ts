import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentService } from './document.service';
import { Document } from './document';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatSortHeaderIntl } from '@angular/material';
import { MatPaginator, MatSort } from '@angular/material';
import { DocumentDatabase } from './document-database.component';
import { DocumentDataSource } from './document-datasource.component';
import { ModalComponent } from '../../../modal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ngx-document-component',
  templateUrl: './document-component.html',
  styleUrls: ['./document-component.scss'],
})

export class FormsDocumentComponent implements OnInit {
  constructor(private document_service: DocumentService, private modalService: NgbModal) { }

  aDocument: DocumentDataSource | null;
  length: number;
  closeResult: any;

  displayedColumns= ['ID', 'name', 'Operations'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getDocumentlist();
  }

  getDocumentlist() {
    this.document_service.get_DocumentList().then(data => {
      this.length = data.length;
      this.aDocument = new DocumentDataSource(new DocumentDatabase( data ), this.sort, this.paginator);
    });
  }

  deleteDocument(document_id): void {
    this.document_service.delete_Document(document_id)
    .then(response => {
    })
    .catch(this.handleError);
    this.getDocumentlist();
  }

  // Modal related
  showStaticModal(name, document_id) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      container: 'nb-layout',
    });

    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = `Are you sure you want to delete ${name}?`;
    activeModal.result.then((result) => {
      this.closeResult = result;
      if (this.closeResult === 'yes_click') {
        this.deleteDocument(document_id);
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

  downloadDocument(document_id): void {
    this.document_service.get_Documentdownload(document_id);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
