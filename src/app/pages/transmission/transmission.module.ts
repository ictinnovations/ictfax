import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { TransmissionRoutingModule, routedComponents } from './transmission-routing.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
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
export class TransmissionModule {}