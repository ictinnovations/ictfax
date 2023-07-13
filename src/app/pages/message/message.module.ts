import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { MessageRoutingModule, routedComponents } from './message-routing.module';
import { FormsDocumentComponent } from '../message/document/document-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule} from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { FileUploadModule } from 'ng2-file-upload';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NbCardModule, NbIconModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
    imports: [
      ThemeModule,
      MessageRoutingModule,
      MatTableModule,
      CdkTableModule,
      MatSortModule,
      FileUploadModule,
      MatButtonModule,
      MatPaginatorModule,
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
  export class MessageModule { }
