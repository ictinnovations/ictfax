import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { IncomingNumberRoutingModule, routedComponents } from './incoming_number-routing.module';
import { FormsIncomingNumberComponent } from './incoming_number-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { IncomingNumberService } from './incoming_number.service';
import { MatIconModule, MatSortModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { NbCardModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    ThemeModule,
    IncomingNumberRoutingModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    NbCardModule,
    MatIconModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class IncomingNumberModule { }
