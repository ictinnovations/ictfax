import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { IncomingNumberRoutingModule, routedComponents } from './incoming_cid_number-routing.module';
import { FormsIncomingCIDNumberComponent } from './incoming_cid_number-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { IncomingCIDNumberService, } from './incoming_cid_number.service';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NbCardModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CIDService } from '../cid/cid.service';



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
    RouterModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [IncomingCIDNumberService,CIDService],
})
export class IncomingCIDNumberModule { }
