import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { ExtensionRoutingModule, routedComponents } from './extension-routing.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule, MatIconModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { NbCardModule, NbIconModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ThemeModule,
    ExtensionRoutingModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    MatRadioModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    NbIconModule
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class ExtensionModule { }
