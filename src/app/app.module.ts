/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { FileUploadModule } from 'ng2-file-upload';
import { Http, RequestOptions } from '@angular/http';
import { HttpResponse } from '@angular/common/http';
import { NbAuthModule } from '@nebular/auth';
import { MatDialogModule } from '@angular/material';
import { ModalComponent } from './modal.component';
import { Ng2CompleterModule } from "ng2-completer";
import { NbSidebarModule, NbMenuModule, NbDatepickerModule, NbDialogModule, NbWindowModule, NbToastrModule, NbChatModule } from '@nebular/theme';

import { APP_INITIALIZER } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpModule } from '@angular/http';
import { LoginComponent } from './auth/login/login.component';
import { AuthModule } from './auth/auth.module';

export function initializeApp() {
  
}


@NgModule({
    declarations: [AppComponent, ModalComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        HttpModule,
        NgbModule,
        NbAuthModule,
        AuthModule,
        ThemeModule.forRoot(),
        NbSidebarModule.forRoot(),
        NbMenuModule.forRoot(),
        NbDatepickerModule.forRoot(),
        NbDialogModule.forRoot(),
        NbWindowModule.forRoot(),
        NbToastrModule.forRoot(),
        NbChatModule.forRoot({
            messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
        }),
        CoreModule.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
