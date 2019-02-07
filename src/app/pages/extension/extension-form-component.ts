import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Extension } from './extension';
import { ExtensionService } from './extension.service';
import 'rxjs/add/operator/toPromise';
import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, Validator, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'ngx-add-extension-component',
  templateUrl: './extension-form-component.html',
  styleUrls: ['./extension-form-component.scss'],
})


export class AddExtensionComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private account_service: ExtensionService,
  private router: Router) { }


  // form1: any= {};
  extension: Extension= new Extension;
  account_id: any= null;
  form: FormGroup;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.account_id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.account_service.get_ExtensionData(this.account_id).then(data => {
          this.extension = data;
        });
      }
    });
  }

  addExtension(): void {
    this.extension.type = 'extension';
    this.account_service.add_Extension(this.extension).then(response => {
      this.router.navigate(['../../extension'], {relativeTo: this.route});
    });
  }

  updateExtension(): void {
    this.account_service.update_Extension(this.extension).then(() => {
      this.router.navigate(['../../extension'], {relativeTo: this.route});
    })
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
