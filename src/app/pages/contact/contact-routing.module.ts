import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactComponent } from './contact.component';
import { FormsContactComponent } from './contact-component';
import { AddContactComponent } from './contact-form-component';
import { FormsGroupComponent } from './group/group-component';
import { AddGroupComponent } from './group/group-form-component';

const routes: Routes = [{
  path: '',
  component: ContactComponent,
  children: [{
    path: 'contacts',
    component: FormsContactComponent,
  }, {
    path: 'contacts/new',
    component: AddContactComponent,
  }, {
    path: 'contacts/:id',
    component: AddContactComponent,
  }, {
    path: 'contacts/:id/delete',
    component: FormsContactComponent,
  }, 
  {
    path: 'group',
    component: FormsGroupComponent,
  }, {
    path: 'group/new',
    component: AddGroupComponent,
  }, {
    path: 'group/:id',
    component: AddGroupComponent,
  }, {
    path: 'group/:id/delete',
    component: AddGroupComponent,
  }
],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class ContactRoutingModule {

}

export const routedComponents = [
  ContactComponent,
  FormsContactComponent,
  AddContactComponent,
  FormsGroupComponent,
  AddGroupComponent,
];

