/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CoreModule } from './@core/core.module';
import { MatSortModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { NB_AUTH_TOKEN_WRAPPER_TOKEN, NbAuthJWTToken, NbAuthSimpleToken } from '@nebular/auth';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { NgxLoginComponent } from './auth/login/login.component';
import { NgxLogoutComponent } from './auth/logout/logout.component';
import { FileUploadModule } from 'ng2-file-upload';
import { Http, RequestOptions } from '@angular/http';
import { HttpResponse } from '@angular/common/http';
import { NbAuthModule, NbEmailPassAuthProvider } from '@nebular/auth';
import { MatDialogModule } from '@angular/material';
import { ModalComponent } from './modal.component';

import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}


@NgModule({
  declarations: [AppComponent, NgxLoginComponent, NgxLogoutComponent, ModalComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    FileUploadModule,
    RouterModule,
    MatDialogModule,

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent],
  providers: [
    AppConfig,
       { provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [AppConfig], multi: true },
    { provide: APP_BASE_HREF, useValue: '/' },
    AuthGuard,
    { provide: NB_AUTH_TOKEN_WRAPPER_TOKEN, useClass: NbAuthJWTToken },
  ],
})
export class AppModule {
}
