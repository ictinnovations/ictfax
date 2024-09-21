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

  displayedColumns= ['ID', 'username', 'phone', 'email', 'Operations'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild('filter', {static: false}) filter: ElementRef;

  ngOnInit() {
    this.getExtensionlist();
  }

  getExtensionlist() {
    this.extension_service.get_ExtensionList().then(data => {
      this.length = data.length;
      this.ExtensionDataSource = this. dataSourceBuilder.create( this. aExtension.map(item => ({ data: item})),);

      // Observable for the filter
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
     .debounceTime(150)
     .distinctUntilChanged()
     .subscribe(() => {
       if (!this.aExtension) { return; }
       this.aExtension.filter = this.filter.nativeElement.value;
      });
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
