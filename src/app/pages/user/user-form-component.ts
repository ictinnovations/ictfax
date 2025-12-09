import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule, FormGroup, FormBuilder, FormControl, NG_VALIDATORS, Validator, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { User } from './user';
import { AUserService } from './user.service';
import 'rxjs/add/operator/toPromise';
import { Directive, forwardRef, Attribute } from '@angular/core';
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
  role:any;
  toppings = new FormControl();

  ngOnInit(): void {
    this.getAllRoles();
    this.route.params.subscribe(params => {
      this.user_id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.user_service.get_UserData(this.user_id).then(data => {
          this.user = data;
          this.getUserRoles(this.user.user_id);
        });
      }
    });
  }

  getAllRoles() {
    this.user_service.get_RoleList().then(response => {
      this.role = response;
      this.role.forEach(element => {
        element.state = null;
      });
    })
  }

  getUserRoles(user_id) {
    this.user_service.getUserRoles(user_id).then(response => {
      if (response.length != 0) {
        response.forEach(element => {
          this.role.forEach(roles => {
            if (element.role_id == roles.role_id) {
              roles.state = true;
            }
          });
        });
      }
    })
  }

  addUser(): void {
    this.user_service.add_User(this.user).then(response => {
      this.setRoles(response);
      this.router.navigate(['../../user'], {relativeTo: this.route});
    });
  }

  updateUser(): void {
    this.user_service.update_User(this.user).then(() => {
      this.setRoles(this.user.user_id);
      this.router.navigate(['../../user'], {relativeTo: this.route});
    });
  }

  addRoles(user_id, role_id) {
    this.user_service.setRole(user_id, role_id).then(response => {
    })
  }

  setRoles(user_id) {
    this.role.forEach(element => {
      if (element.state == true) {
        this.addRoles(user_id, element.role_id);
      }
      else if (element.state == null || element.state == false) {
        this.deleteRoles(user_id, element.role_id);
      }
    })  
  }

  deleteRoles(user_id, role_id) {
    this.user_service.deleteRoles(user_id, role_id).then(response => {
    })
  }

  onChange(role_id, is_checked) {
    this.role.forEach(element => {
      if (role_id == element.role_id) {
        element.state = is_checked;
      }
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
