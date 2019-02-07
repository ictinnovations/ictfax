import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { IncomingNumber } from './incoming_number';
import { IncomingNumberService } from './incoming_number.service';
import { DIDService } from '../did/did.service';
import { ExtensionService } from '../extension/extension.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'ngx-forward-incoming-component',
  templateUrl: './forward-incoming_number-component.html',
  styleUrls: ['./forward-incoming_number-component.scss'],
})

export class ForwardIncomingNumberComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private in_number_service: IncomingNumberService,
  private router: Router, private did_service: DIDService, private ext_service: ExtensionService) { }


  form1: any= {};
  incomingNumber: IncomingNumber= new IncomingNumber;
  id: any= null;
  exts: any = [];

  ngOnInit(): void {
    this.getAllExt();
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.in_number_service.get_Data(this.id).then(data => {
          this.incomingNumber = data;
          this.incomingNumber.service_name = '';
        });
      }
    });
  }

  getAllExt() {
    this.ext_service.get_ExtensionList().then(response => {
      this.exts = response;
    });
  }

  forwardDID(): void {
    if (this.incomingNumber.service_name == 'no_service' ) {
      this.did_service.no_service(this.incomingNumber.account_id).then(response => {
        this.router.navigate(['../../../incoming_number'], {relativeTo: this.route});
      });
    } else if (this.incomingNumber.service_name == 'faxtoemail' ) {
      if (this.incomingNumber.email == null || this.incomingNumber.email == undefined) {
        this.did_service.send_program(this.incomingNumber).then(response => {
          this.router.navigate(['../../../incoming_number'], {relativeTo: this.route});
        });
      } else {
        this.in_number_service.update_account(this.incomingNumber).then(data => {
          this.did_service.send_program(this.incomingNumber).then(response => {
            this.router.navigate(['../../../incoming_number'], {relativeTo: this.route});
          });
        })  
      }
    } else if (this.incomingNumber.service_name == 'forwardtoext' ) {
        this.incomingNumber.did_id = this.incomingNumber.account_id;
        this.in_number_service.forwardtoext(this.incomingNumber).then(response => {
          this.router.navigate(['../../../incoming_number'], {relativeTo: this.route});
        });
      }  
      else {
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
