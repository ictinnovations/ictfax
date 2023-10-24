import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InFaxComponent } from './infax/infax-component';
import { ChangePasswordComponent } from './changepassword/changepassword-component';
import { CampaignComponent } from './campaigns/campaign.component';
import { CIDComponent } from './cid/cid.component';
import { IncomingCIDNumberComponent } from './incoming_cid_number/incoming_cid_number.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'infax',
    component: InFaxComponent
  },
 
  {  
    path: 'Changepass',
    component: ChangePasswordComponent
  },
  {

    path: 'faxsettings',
    component: FaxSettingsComponent,
  },
  {
    path: 'cid',
    component: CIDComponent,
  },
  {
    path: 'incoming_cid_number',
    component: IncomingCIDNumberComponent,
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module')
    .then(m => m.ContactModule),
  },
  
  {
    path: 'campaigns',
    loadChildren: () => import('./campaigns/campaign.module')
    .then(m => m.CampaignModule),
  },{
    path: 'message',
    loadChildren: () => import('./message/message.module')
    .then(m => m.MessageModule),
  }, {
    path: 'transmission',
    loadChildren: () => import('./transmission/transmission.module')
        .then(m => m.TransmissionModule),
  }, {
    path: 'provider',
    loadChildren: () => import('./provider/provider.module')
        .then(m => m.ProviderModule),
  }, {
    path: 'user',
    loadChildren: () => import('./user/user.module')
    .then(m => m.UserModule),
  }, {
    path: 'extension',
    loadChildren: () => import('./extension/extension.module')
        .then(m => m.ExtensionModule),
  },{
    path: 'incoming_number',
    loadChildren: () => import('./incoming_number/incoming_number.module')
      .then(m => m.IncomingNumberModule),
  }, {
    path: 'sendfax',
    loadChildren: () => import('./sendfax/sendfax.module')
      .then(m => m.SendFaxModule),
  }, {
    path: 'did',
    loadChildren: () => import('./did/did.module')
      .then(m => m.DIDModule),
  },
  {
    path: 'cid',
    loadChildren: () => import('./cid/cid.module')
      .then(m => m.CIDModule),
  },
  {
    path: 'incoming_cid_number',
    loadChildren: () => import('./incoming_cid_number/incoming_cid_number.module')
      .then(m => m.IncomingCIDNumberModule),
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
