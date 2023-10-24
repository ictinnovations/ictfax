import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CIDComponent } from './cid.component';
import { FormsCIDComponent } from './cid-component';
import { AddCIDComponent } from './cid-form-component';
import { BatchCIDComponent } from './batch-cid-component';
import { ImportCIDComponent } from './import-cid-component';
import { AssignCIDComponent } from './assign-cid-component';

const routes: Routes = [{
  path: '',
  component: CIDComponent,
  children: [{
    path: 'cid',
    component: FormsCIDComponent,
  }, {
    path: 'cid/new',
    component: AddCIDComponent,
  }, {
    path: 'cid/batch',
    component: BatchCIDComponent,
  }, {
    path: 'cid/import',
    component: ImportCIDComponent,
  }, {
    path: 'cid/:id',
    component: AddCIDComponent,
  }, {
    path: 'cid/:id/assign',
    component: AssignCIDComponent,
  }, {
    path: 'cid/:id/delete',
    component: AddCIDComponent,
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
export class CIDRoutingModule {

}

export const routedComponents = [
  CIDComponent,
  FormsCIDComponent,
  AddCIDComponent,
  BatchCIDComponent,
  ImportCIDComponent,
  AssignCIDComponent,
];
