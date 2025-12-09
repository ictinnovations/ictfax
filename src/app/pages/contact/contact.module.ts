import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ContactRoutingModule, routedComponents } from './contact-routing.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule  } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FileUploadModule } from 'ng2-file-upload';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbOptionModule, NbSelectModule, NbTreeGridModule } from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Ng2CompleterModule } from "ng2-completer";


@NgModule({
  imports: [
    ThemeModule,
    ContactRoutingModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    FileUploadModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbIconModule,
    TranslateModule,
    Ng2CompleterModule,
    NbInputModule,
    NbTreeGridModule,
    NbSelectModule,
    NbOptionModule,
    NbButtonModule,

  ],
  declarations: [
    ...routedComponents,
  ],
})
export class ContactModule { }
