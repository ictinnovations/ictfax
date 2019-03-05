import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendFaxComponent } from './sendfax.component';
import { FormsSendFaxComponent } from './sendfax-component';
import { AddSendFaxComponent } from './sendfax-form-component';


const routes: Routes = [{
  path: '',
  component: SendFaxComponent,
  children: [{
    path: 'sendfax',
    component: FormsSendFaxComponent,
  }, {
    path: 'sendfax/new',
    component: AddSendFaxComponent,
  }],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class SendFaxRoutingModule {

}

export const routedComponents = [
  SendFaxComponent,
  FormsSendFaxComponent,
  AddSendFaxComponent,
];
