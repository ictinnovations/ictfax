import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DIDComponent } from './did.component';
import { FormsDIDComponent } from './did-component';
import { AddDIDComponent } from './did-form-component';
import { BatchDIDComponent } from './batch-did-component';
import { ImportDIDComponent } from './import-did-component';
import { AssignDIDComponent } from './assign-did-component';

const routes: Routes = [{
  path: '',
  component: DIDComponent,
  children: [{
    path: 'did',
    component: FormsDIDComponent,
  }, {
    path: 'did/new',
    component: AddDIDComponent,
  }, {
    path: 'did/batch',
    component: BatchDIDComponent,
  }, {
    path: 'did/import',
    component: ImportDIDComponent,
  }, {
    path: 'did/:id',
    component: AddDIDComponent,
  }, {
    path: 'did/:id/assign',
    component: AssignDIDComponent,
  }, {
    path: 'did/:id/delete',
    component: AddDIDComponent,
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
export class DIDRoutingModule {

}

export const routedComponents = [
  DIDComponent,
  FormsDIDComponent,
  AddDIDComponent,
  BatchDIDComponent,
  ImportDIDComponent,
  AssignDIDComponent,
];
