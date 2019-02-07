import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderComponent } from './provider.component';
import { FormsProviderComponent } from './provider-component';
import { AddProviderComponent } from './provider-form-component';

const routes: Routes = [{
  path: '',
  component: ProviderComponent,
  children: [{
    path: 'provider',
    component: FormsProviderComponent,
  }, {
    path: 'provider/new',
    component: AddProviderComponent,
  }, {
    path: 'provider/:id',
    component: AddProviderComponent,
  }, {
    path: 'provider/:id/delete',
    component: AddProviderComponent,
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
export class ProviderRoutingModule {

}

export const routedComponents = [
  ProviderComponent,
  FormsProviderComponent,
  AddProviderComponent,
];
