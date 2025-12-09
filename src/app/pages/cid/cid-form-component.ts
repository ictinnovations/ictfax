import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { CID } from './cid';
import { CIDService } from './cid.service';
import 'rxjs/add/operator/toPromise';
import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, Validator, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'ngx-add-cid-component',
  templateUrl: './cid-form-component.html',
  styleUrls: ['./cid-form-component.scss'],
})


export class AddCIDComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private account_service: CIDService,
  private router: Router) { }

  // form1: any= {};
  cid: CID= new CID;
  account_id: any= null;
  form: FormGroup;

  isError = false;
  errorText: any = [];

  ngOnInit(): void {
    this.cid.active = 1;
    this.route.params.subscribe(params => {
      this.account_id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.account_service.get_CIDData(this.account_id).then(data => {
          this.cid = data;
        });
      }
    });
  }

  addCID(): void {
    this.checkFields();
    if (this.errorText.length === 0) {
      this.cid.type = 'cid';
      this.cid.username = this.cid.phone;
      this.account_service.add_CID(this.cid).then(response => {
        this.router.navigate(['../../cid'], {relativeTo: this.route});
      });
    }else{
      this.errorHandler(true, this.errorText);
    }
  }

  updateCID(): void {
    this.checkFields();
    if (this.errorText.length === 0) {
      this.account_service.update_CID(this.cid).then(() => {
        this.router.navigate(['../../cid'], {relativeTo: this.route});
      })
      .catch(this.handleError);
    }else{
      this.errorHandler(true, this.errorText);
    }
  }

  private checkFields(status = null):any{
    this.errorHandler(false, [])
    if (!this.cid.phone) this.errorText.push("CID Number is required.");
  }

  private errorHandler(status, message):any{
    this.isError = status;
    this.errorText = message;
    if (status) {
      setTimeout(() => {
        this.isError = false;
        this.errorText = [];
      }, 10000);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
