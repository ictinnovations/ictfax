import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { IncomingNumberRoutingModule, routedComponents } from './incoming_number-routing.module';
import { FormsIncomingNumberComponent } from './incoming_number-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { IncomingNumberService } from './incoming_number.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NbCardModule, NbIconModule, NbInputModule, NbOptionModule, NbSelectModule, NbTreeGridModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


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
    ReactiveFormsModule,
    TranslateModule,
    NbInputModule,
    NbTreeGridModule,
    NbOptionModule,
    NbSelectModule,
    NbIconModule
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class IncomingNumberModule { }
