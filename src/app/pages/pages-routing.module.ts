import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErrorComponent } from './error-handler/error-handler.component';
import { DefaultSettingsComponent } from './default_settings/default_settings-component';
import { InFaxComponent } from './infax/infax-component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'Error',
    component: ErrorComponent,
  },
  {
    path: 'infax',
    component: InFaxComponent,
  },
  {
    path: 'contact',
    loadChildren: './contact/contact.module#ContactModule',
  }, {
    path: 'message',
    loadChildren: './message/message.module#MessageModule',
  }, {
    path: 'transmission',
    loadChildren: './transmission/transmission.module#TransmissionModule',
  }, {
    path: 'provider',
    loadChildren: './provider/provider.module#ProviderModule',
  }, {
    path: 'user',
    loadChildren: './user/user.module#UserModule',
  }, {
    path: 'incoming_number',
    loadChildren: './incoming_number/incoming_number.module#IncomingNumberModule',
  }, {
    path: 'extension',
    loadChildren: './extension/extension.module#ExtensionModule',
  },{
    path: 'sendfax',
    loadChildren: './sendfax/sendfax.module#SendFaxModule',
  }, {
    path: 'did',
    loadChildren: './did/did.module#DIDModule',
  },
   {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
