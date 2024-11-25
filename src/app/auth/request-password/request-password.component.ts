
import { ChangeDetectionStrategy,Component, Inject } from '@angular/core';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { getDeepFromObject } from '@nebular/auth';
import { SigninService } from '../signin/signin.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'ngx-request-password',
  styleUrls: ['./request-password.component.scss'],
  templateUrl: './request-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestPasswordComponent {

  submitted = false;
  user: any = {};

  constructor(
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    private signin_service: SigninService,
    private snackBar: MatSnackBar
  ) {}

  requestPass() {
    this.submitted = true;
    this.signin_service.requestPassword(this.user.email).then(
      (response) => {
        this.openSnackBar('Reset password link sent to your email. Check your email!');
      },
      (error) => {
        if (error.status === 401) {
          this.openSnackBar('Email not registered. Please check your email and try again.');
        } else {
          this.openSnackBar('An error occurred. Please try again later.');
        }
      }
    );
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }


}