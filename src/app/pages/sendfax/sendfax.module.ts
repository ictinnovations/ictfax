import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { SendFaxRoutingModule, routedComponents } from './sendfax-routing.module';
import { FormsSendFaxComponent } from '../../pages/sendfax/sendfax-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { SendFaxService } from './sendfax.service';
import { MatSortModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MatButtonModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import {MatTabsModule} from '@angular/material/tabs';

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
    MatTabsModule
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class SendFaxModule { }
