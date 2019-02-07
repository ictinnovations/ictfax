import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessageComponent } from './message.component';
import { FormsDocumentComponent } from './document/document-component';
import { AddDocumentComponent } from './document/document-form-component';


const routes: Routes = [{
  path: '',
  component: MessageComponent,
  children: [{
    path: 'document',
    component: FormsDocumentComponent,
  }, {
    path: 'document/new',
    component: AddDocumentComponent,
  }, {
    path: 'document/:id',
    component: AddDocumentComponent,
  }, {
    path: 'document/:id/download',
    component: FormsDocumentComponent,
  }, {
    path: 'document/:id/delete',
    component: AddDocumentComponent,
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
export class MessageRoutingModule {

}

export const routedComponents = [
  MessageComponent,
  FormsDocumentComponent,
  AddDocumentComponent,
];
