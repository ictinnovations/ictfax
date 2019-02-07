import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { IncomingNumberRoutingModule, routedComponents } from './incoming_number-routing.module';
import { FormsIncomingNumberComponent } from './incoming_number-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { IncomingNumberService } from './incoming_number.service';
import { MatSortModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';


@NgModule({
  imports: [
    ThemeModule,
    IncomingNumberRoutingModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class IncomingNumberModule { }
