import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { TransmissionRoutingModule, routedComponents } from './transmission-routing.module';
import { FormsTransmissionComponent } from '../../pages/transmission/transmission-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { TransmissionService } from '../../pages/transmission/transmission.service';
import { MatSortModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    ThemeModule,
    TransmissionRoutingModule,
    MatTableModule,
    MatButtonModule,
    CdkTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class TransmissionModule { }
