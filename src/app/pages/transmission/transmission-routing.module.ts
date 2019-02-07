import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransmissionComponent } from './transmission.component';
import { FormsTransmissionComponent } from './transmission-component';
import { AddTransSendDocumentComponent } from './senddocument/transmission-senddocument';


const routes: Routes = [{
  path: '',
  component: TransmissionComponent,
  children: [{
    path: 'transmissions',
    component: FormsTransmissionComponent,
  }, {
    path: 'transsenddocument/new',
    component: AddTransSendDocumentComponent,
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
export class TransmissionRoutingModule {

}

export const routedComponents = [
  TransmissionComponent,
  FormsTransmissionComponent,
  AddTransSendDocumentComponent,
];
