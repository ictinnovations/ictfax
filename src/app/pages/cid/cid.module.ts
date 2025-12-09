import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { CIDRoutingModule, routedComponents } from './cid-routing.module';
import { FormsCIDComponent } from './cid-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { CIDService } from './cid.service';
import { MatSortModule  } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { FileUploadModule } from 'ng2-file-upload';
import { NbCardModule, NbIconModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    ThemeModule,
    CIDRoutingModule,
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
    NbIconModule,
    TranslateModule
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [CIDService],
})
export class CIDModule { }
