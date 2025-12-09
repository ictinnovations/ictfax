import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Transmission, DocumentProgram } from '../transmission';
import { TransmissionService } from '../transmission.service';
import { DocumentService } from '../../message/document/document.service';
import { Document } from '../../message/document/document';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'ngx-add-transmission-component',
  templateUrl: './transmission-senddocument.html',
  styleUrls: ['./transmission-senddocument.scss'],
})

export class AddTransSendDocumentComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private document_service: DocumentService,
  private transmission_service: TransmissionService, private router: Router) { }


  form1: any = {};
  documentProgram: DocumentProgram = new DocumentProgram;
  program_id: any = null;
  transmission: Transmission = new Transmission;
  document: Document[] = [];
  selectedDocument: Document;
  trans_id: number;

  ngOnInit(): void {
    this.getDocumentlist();
  }

  addSendDocument(): void {
    this.transmission_service.add_senddocument(this.documentProgram).then(response => {
      const program_id = response;
      this.transmission.program_id = program_id;
      this.AddTransmission();
      this.router.navigate(['../../transmissions'], {relativeTo: this.route});
    });
  }

  AddTransmission(): void {
    this.transmission_service.add_Transmission(this.transmission).then(response => {
      const transmission_id = response;
      this.trans_id = transmission_id;
      this.AddSend(this.trans_id);
    });
  }

  AddSend(trans_id): void {
    this.transmission_service.send_transmission(this.trans_id).then(response => {
    });
  }

  getDocumentlist() {
    this.document_service.get_DocumentList().then(data => {
      this.document = data;
    });
  }

  get selectedDoc() {
    return this.selectedDocument;
  }

  set selectedDoc(value) {
    this.selectedDocument = value;
    this.documentProgram.document_id = this.selectedDocument.document_id;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
