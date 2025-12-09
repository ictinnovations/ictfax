/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule } from '@nebular/theme';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { TranslateModule } from '@ngx-translate/core';
import { RequestPasswordComponent} from './request-password/request-password.component'
import { ResetPasswordComponent} from './reset-password/reset-password.component'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    MatIconModule,
    NbIconModule,
    NbCheckboxModule,
    AuthRoutingModule,
    TranslateModule,
    NbAuthModule,
    MatSnackBarModule,
    RouterModule
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    SigninComponent,
    RequestPasswordComponent,
    ResetPasswordComponent
  ],
})
export class AuthModule {
}