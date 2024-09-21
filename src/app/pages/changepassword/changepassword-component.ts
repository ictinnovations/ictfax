import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { AppService } from '../../app.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { User } from '../user/user';
import { FormsModule, FormGroup, FormBuilder, FormControl, NG_VALIDATORS, Validator, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { AUserService } from '../user/user.service';

@Component({
  selector: 'ngx-handler',
  template: `<div class="row">
               <div class="col-md-12">
                 <nb-card>
                   <nb-card-body>
                     <div class="flex-centered col-xl-4 col-lg-6 col-md-8 col-sm-12">
                       <h2 class="title">Change Password</h2>
                       <br>
                       <!--
                       <small class="sub-title">The server encountered an internal error or misconfiguration and was unable to complete your request.</small>
                       !-->
                       <form id="form" #f1="ngForm">
                       <div class="form-group">
                       <label for="password">Password</label>
               <input type="password" class="form-control" nbInput fullWidth id="password"
               required
               [(ngModel)]="user.password" name="password"
               #password="ngModel">
               <div [hidden]="password.valid || password.pristine" class="alert alert-danger">
                 Password is required
               </div>
             </div>
             <div class="form-group">
               <label for="name">Confirm Password</label>
               <input type="password" class="form-control" nbInput fullWidth id="confirmPassword"
               required
               ngx_validateCheck="password"
               [(ngModel)]="user.confirmPassword" name="confirmPassword"
               #confirmPassword="ngModel">
               <div [hidden]="confirmPassword.valid || confirmPassword.pristine"
                 class="alert alert-danger">
                 Passwords did not match
               </div>
             </div>
                       </form>
                       <button nbButton fullWidth status="success" (click)="goToHome()">Submit</button>
  	                 </div>
  	               </nb-card-body>
  	            </nb-card>
  	          </div>
  	       </div>`,
  styleUrls: ['./changepassword-component.scss'],
})
export class ChangePasswordComponent {

  constructor(private router: Router, private authService: NbAuthService, private user_service: AUserService) {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
      if (token && token.getValue()) {
        this.auser = token.getPayload();
        this.user.user_id = this.auser.user_id;
      }
    })
  }

  user: User = new User;
  form: FormGroup;
  auser:any;

  goToHome() {
    this.user_service.changePass(this.user).then(response => {
      this.router.navigate(['pages/dashboard']);
    })
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
