import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DocumentService } from './document.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DocumentDatabase } from './document-database.component';
import { DocumentDataSource } from './document-datasource.component';
import { ModalComponent } from '../../../modal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';

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

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild('filter', {static: false}) filter: ElementRef;

  ngOnInit() {
    this.getDocumentlist();
  }

  getDocumentlist() {
    this.document_service.get_DocumentList().then(data => {
      this.length = data.length;
      this.aDocument = new DocumentDataSource(new DocumentDatabase( data ), this.sort, this.paginator);

      //Sort the data automatically

      const sortState: Sort = {active: 'ID', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);

      // Observable for the filter
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
     .debounceTime(150)
     .distinctUntilChanged()
     .subscribe(() => {
       if (!this.aDocument) { return; }
       this.aDocument.filter = this.filter.nativeElement.value;
      });
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