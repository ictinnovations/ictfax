import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { User } from './user';
import { AUserService } from './user.service';
import 'rxjs/add/operator/toPromise';
import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, Validator, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { EqualValidator } from './password.match.directive';

@Component({
  selector: 'ngx-add-user-component',
  templateUrl: './user-form-component.html',
  styleUrls: ['./user-form-component.scss'],
})


export class AddUserComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private user_service: AUserService,
  private router: Router) { }


  // form1: any= {};
  user: User= new User;
  user_id: any= null;
  form: FormGroup;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.user_id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.user_service.get_UserData(this.user_id).then(data => {
          this.user = data;
        });
      }
    });
  }

  addUser(): void {
    this.user_service.add_User(this.user).then(response => {
      this.router.navigate(['../../user'], {relativeTo: this.route});
    });
  }


  updateUser(): void {
    this.user_service.update_User(this.user).then(() => {
      this.router.navigate(['../../user'], {relativeTo: this.route});
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
