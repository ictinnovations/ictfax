import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { SendFaxRoutingModule, routedComponents } from './sendfax-routing.module';
import { FormsSendFaxComponent } from '../../pages/sendfax/sendfax-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { SendFaxService } from './sendfax.service';
import { MatSortModule } from '@angular/material';
import { MatPaginatorModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import {MatTabsModule} from '@angular/material/tabs';
import { Ng2CompleterModule } from "ng2-completer";
import { NbCardModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [
    ThemeModule,
    SendFaxRoutingModule,
    MatTableModule,
    MatButtonModule,
    CdkTableModule,
    MatSortModule,
    FileUploadModule,
    MatPaginatorModule,
    MatTabsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    Ng2CompleterModule,
    NbCardModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class SendFaxModule { }
