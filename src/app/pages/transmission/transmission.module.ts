import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { TransmissionRoutingModule, routedComponents } from './transmission-routing.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule, MatIconModule, MatButtonModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { NbCardModule, NbIconModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusCardComponent } from './status-card/status-card.component';

@NgModule({
  imports: [
    ThemeModule,
    TransmissionRoutingModule,
    MatTableModule,
    MatButtonModule,
    CdkTableModule,
    MatSortModule,
    MatPaginatorModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    NbIconModule,
  ],
  declarations: [
    ...routedComponents,
    StatusCardComponent
  ],
})
export class TransmissionModule { }
