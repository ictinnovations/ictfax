import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtensionComponent } from './extension.component';
import { FormsExtensionComponent } from './extension-component';
import { AddExtensionComponent } from './extension-form-component';

const routes: Routes = [{
  path: '',
  component: ExtensionComponent,
  children: [{
    path: 'extension',
    component: FormsExtensionComponent,
  }, {
    path: 'extension/new',
    component: AddExtensionComponent,
  }, {
    path: 'extension/:id',
    component: AddExtensionComponent,
  }, {
    path: 'extension/:id/delete',
    component: AddExtensionComponent,
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
export class ExtensionRoutingModule {

}

export const routedComponents = [
  ExtensionComponent,
  FormsExtensionComponent,
  AddExtensionComponent,
];
