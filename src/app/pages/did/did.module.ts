import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { DIDRoutingModule, routedComponents } from './did-routing.module';
import { FormsDIDComponent } from './did-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { DIDService } from './did.service';
import { MatSortModule, MatPaginator } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    ThemeModule,
    DIDRoutingModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    MatRadioModule,
    DropDownsModule,
    FileUploadModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class DIDModule { }
