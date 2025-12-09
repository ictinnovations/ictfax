import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncomingCIDNumberComponent } from './incoming_cid_number.component';
import { FormsIncomingCIDNumberComponent } from './incoming_cid_number-component';
import { EditIncomingCIDNumberComponent } from './edit-incoming_cid_number-component';
import { AssignIncomingCIDNumberComponent } from './assign-incoming_cid_number-component';

const routes: Routes = [{
  path: '',
  component: IncomingCIDNumberComponent,
  children: [{
    path: 'incoming_cid_number',
    component: FormsIncomingCIDNumberComponent,
  }, {
    path: 'incoming_cid_number/:id',
    component: EditIncomingCIDNumberComponent,
  },
   {
    path: 'incoming_cid_number/:id/assign',
    component: AssignIncomingCIDNumberComponent,
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
export class IncomingNumberRoutingModule {

}

export const routedComponents = [
  IncomingCIDNumberComponent,
  FormsIncomingCIDNumberComponent,
  EditIncomingCIDNumberComponent,
  AssignIncomingCIDNumberComponent,
];
