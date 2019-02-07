import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { ExtensionRoutingModule, routedComponents } from './extension-routing.module';
import { FormsExtensionComponent } from './extension-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { ExtensionService } from './extension.service';
import { MatSortModule, MatPaginator } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

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
    DropDownsModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class ExtensionModule { }
