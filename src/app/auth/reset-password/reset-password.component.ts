/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { getDeepFromObject } from '@nebular/auth';
import { NbAuthService } from '@nebular/auth';
import { NbAuthResult } from '@nebular/auth';
import { SigninService } from '../signin/signin.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'ngx-reset-password',
  styleUrls: ['./reset-password.component.scss'],
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {

  submitted = false;
  user: any = {};
  code : any;

  constructor(protected service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              protected cd: ChangeDetectorRef,
              protected router: Router,
              private signin_service: SigninService,
              private route : ActivatedRoute,
              private snackBar: MatSnackBar, ) {
}
ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.code = params['code'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
  });
}

resetPass(): void {
  if (this.user.password.value !== this.user.confirmPassword.value) {
    this.submitted = false;
    return;
  }
   this.signin_service.resetPassword(this.user.password, this.code)
    .then(response => {
      this.openSnackBar('Password Has Been Updated Succussfully!');
    },
    (error) => {
      if (error.status === 401) {
        this.openSnackBar('Password does not updated.');
      } else {
        this.openSnackBar('An error occurred. Please try again later.');
      }
    }
  )
   .catch(error => {
      this.snackBar.open('An error occurred. Please try again.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
    })
    .finally(() => {
      this.submitted = false;
    });
}
   private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
    duration: 3000,
    verticalPosition: 'top',
  });
}
  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}