import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { ContactRoutingModule, routedComponents } from './contact-routing.module';
import { FormsContactComponent } from '../../pages/contact/contact-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { ContactService } from '../../pages/contact/contact.service';
import { MatSortModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    ThemeModule,
    ContactRoutingModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    FileUploadModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class ContactModule { }
