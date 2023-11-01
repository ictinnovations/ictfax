import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsContactDNCComponent } from './contact_dnc-component';
import { AddContactDNCComponent } from './contact_dnc-form-component';
import { ContactDNCComponent } from './contact_dnc.component';





const routes: Routes = [{
  path: '',
  component: ContactDNCComponent,
  children: [{
    path: 'contact_dnc',
    component: FormsContactDNCComponent,
  }, {
    path: 'contact_dnc/new',
    component: AddContactDNCComponent,
  }, {
    path: 'contact_dnc/:id',
    component: AddContactDNCComponent,
  },
  {
    path: 'contact_dnc/:id/delete',
    component: FormsContactDNCComponent,
  }
  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [

  ]
})
export class ContactDNCRoutingModule { }


export const routedComponents = [
  AddContactDNCComponent,
  FormsContactDNCComponent,
  ContactDNCComponent
];