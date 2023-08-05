/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { NgModule } from '@angular/core';
 import { BrowserModule } from '@angular/platform-browser';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 import { HttpClientModule, HttpClient } from '@angular/common/http';
 import { CoreModule } from './@core/core.module';
 import { ThemeModule } from './@theme/theme.module';
 import { AppComponent } from './app.component';
 import { AppRoutingModule } from './app-routing.module';
 import { RouterModule, Routes } from '@angular/router';

 import {
   NbChatModule,
   NbDatepickerModule,
   NbDialogModule,
   NbMenuModule,
   NbSidebarModule,
   NbToastrModule,
   NbWindowModule,
 } from '@nebular/theme';
 import { ServiceWorkerModule } from '@angular/service-worker';
 import { environment } from '../environments/environment';
 import { HttpModule } from '@angular/http';
 import { ModalComponent } from './modal.component';
 import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
 import { NbEvaIconsModule } from '@nebular/eva-icons';
 import { AuthModule } from './auth/auth.module';
 import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
 import { TranslateHttpLoader } from '@ngx-translate/http-loader';

 // Social Media Login 
//  import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
//  import { GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';
 // End Social Media Login

/* Changes start here. */


// Import the Angular HTTP interceptor. 
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Add the essential Angular materials.
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
/* Changes end here. */
 
 // AoT requires an exported function for factories
 export function HttpLoaderFactory(httpClient: HttpClient) {
   return new TranslateHttpLoader(httpClient);
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
     NbEvaIconsModule,
     AuthModule,
    //  SocialLoginModule,
     MatButtonModule,
     MatToolbarModule,
     MatListModule,
     MatTableModule,
     RouterModule,
     HttpClientModule,
     MatIconModule,
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

   
   
    
    /* Changes end here. */
     CoreModule.forRoot(),
     TranslateModule.forRoot({
       loader: {
         provide: TranslateLoader,
         useFactory: HttpLoaderFactory,
         deps: [HttpClient]
       }
     }),
     ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
   ],
   bootstrap: [
     AppComponent,
  ]
 })
 export class AppModule {}
 