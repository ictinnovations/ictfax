import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ContactDNCService } from './contact_dnc.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ContactDNCDataSource } from './contact_dnc-datasource.component';
import { ContactDNCDatabase } from './contact_dnc-database.component';
import { ModalComponent } from '../../modal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { AppService } from '../../app.service';
import { ContactDNC } from './contact_dnc';


@Component({
  selector: 'ngx-contact_dnc-component',
  templateUrl: './contact_dnc-component.html',
  styleUrls: ['./contact_dnc-component.scss'],
})


export class FormsContactDNCComponent implements OnInit {
  constructor(private contact_dnc_service: ContactDNCService, private modalService: NgbModal, private app_service: AppService) { }

  URL = `${this.app_service.apiUrlContactDNC}/import/csv`
  public uploader: FileUploader = new FileUploader({ url: this.URL, disableMultipart: true });

  aContactDNC: ContactDNCDataSource | null;
  length: number;
  closeResult: any;
  unsupportedErr: any = false;
  file: any;
  contact_dnc: ContactDNC = new ContactDNC;

  displayedColumns = ['ID', 'first_name', 'last_name', 'phone','email', 'operation'];

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.getContactDNClist();

    setTimeout(() => {
      this.refreshData();
    }, 8000);
    this.uploader.onBeforeUploadItem = (item) => {
      item.method = 'POST';
      item.url = this.URL;
      item.withCredentials = false;
    };
    this.uploader.onAfterAddingFile = (response: any) => {
      this.file = response;
    }
    const authHeader = this.app_service.upload_Header;
    const uploadOptions = <FileUploaderOptions>{ headers: authHeader };
    this.uploader.setOptions(uploadOptions);
    this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
    };

  }
  getContactDNClist() {
    this.contact_dnc_service.get_ContactDNCList().then(data => {
      this.length = data.length;
      this.aContactDNC = new ContactDNCDataSource(new ContactDNCDatabase(data), this.sort, this.paginator);
      // Observable for the filter
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.aContactDNC) { return; }
          this.aContactDNC.filter = this.filter.nativeElement.value;
        });
      //Sort the data automatically
      const sortState: Sort = { active: 'ID', direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    });
  }
  private refreshData(): void {
    this.contact_dnc_service.get_ContactDNCList().then(data => {
      this.length = data.length;
      data.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      })
      this.aContactDNC = new ContactDNCDataSource(new ContactDNCDatabase(data), this.sort, this.paginator);
      // Observable for the filter
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.aContactDNC) { return; }
          this.aContactDNC.filter = this.filter.nativeElement.value;
        });
    });

  }
  deleteContactDNC(contact_dnc): void {
    this.contact_dnc_service.delete_ContactDNC(contact_dnc)
      .then(response => {
      })
      .catch(this.handleError);
    this.getContactDNClist();
  }
  // Modal related
  showStaticModal(name, contact_dnc) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      container: 'nb-layout',
    });
    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = `Are you sure you want to delete ${name}?`;
    activeModal.result.then((result) => {
      this.closeResult = result;
      if (this.closeResult === 'yes_click') {
        this.deleteContactDNC(contact_dnc);
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
      return `with: ${reason}`;
    }
  }
  getCSV() {
    this.contact_dnc_service.getContactDNCCSV();
  }
  uploadFiles() {
    console.log('mafii')
    this.contact_dnc_service.add_ContactDNC(this.contact_dnc).then(response => {
      this.URL = `${this.app_service.apiUrlContactDNC}/import/csv`;
      this.file_upload();
      this.refreshData;
      this.ngOnInit();
    })
  }

  file_upload() {
    this.file.upload();

  }

   private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
