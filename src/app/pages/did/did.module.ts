import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { DIDRoutingModule, routedComponents } from './did-routing.module';
import { FormsDIDComponent } from './did-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { DIDService } from './did.service';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FileUploadModule } from 'ng2-file-upload';
import { NbButtonModule, NbCardModule, NbInputModule, NbOptionModule, NbSelectModule, NbTreeGridModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    ThemeModule,
    DIDRoutingModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    MatRadioModule,
    FileUploadModule,
    NbCardModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NbButtonModule,
    NbTreeGridModule,
    NbInputModule,
    NbOptionModule,
    NbSelectModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class DIDModule { }
