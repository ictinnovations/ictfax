import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { DID } from './did';
import { DIDService } from './did.service';
import 'rxjs/add/operator/toPromise';
import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, Validator, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'ngx-add-did-component',
  templateUrl: './did-form-component.html',
  styleUrls: ['./did-form-component.scss'],
})


export class AddDIDComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private account_service: DIDService,
  private router: Router) { }


  // form1: any= {};
  did: DID= new DID;
  account_id: any= null;
  form: FormGroup;

  ngOnInit(): void {
    this.did.active = 1;
    this.route.params.subscribe(params => {
      this.account_id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.account_service.get_DIDData(this.account_id).then(data => {
          this.did = data;
        });
      }
    });
  }

  addDID(): void {
    this.did.type = 'did';
    this.did.username = this.did.phone;
    this.account_service.add_DID(this.did).then(response => {
      this.router.navigate(['../../did'], {relativeTo: this.route});
    });
  }

  updateDID(): void {
    this.account_service.update_DID(this.did).then(() => {
      this.router.navigate(['../../did'], {relativeTo: this.route});
    })
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
