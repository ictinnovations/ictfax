import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { ProviderRoutingModule, routedComponents } from './provider-routing.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbOptionModule, NbSelectModule, NbTreeGridModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    ThemeModule,
    ProviderRoutingModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    NbIconModule,
    TranslateModule,
    NbButtonModule,
    NbInputModule,
    NbTreeGridModule,
    NbSelectModule,
    NbOptionModule
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class ProviderModule { }
