import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { ProviderRoutingModule, routedComponents } from './provider-routing.module';
import { FormsProviderComponent } from './provider-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { ProviderService } from './provider.service';
import { MatSortModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';


@NgModule({
  imports: [
    ThemeModule,
    ProviderRoutingModule,
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
export class ProviderModule { }
