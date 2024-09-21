import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { SendFaxRoutingModule, routedComponents } from './sendfax-routing.module';
import { FormsSendFaxComponent } from '../../pages/sendfax/sendfax-component';
// import { MatTableModule } from '@angular/material/table';
// import { CdkTableModule } from '@angular/cdk/table';
import { SendFaxService } from './sendfax.service';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule,} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FileUploadModule } from 'ng2-file-upload';
import {MatTabsModule} from '@angular/material/tabs';
import { Ng2CompleterModule } from "ng2-completer";
import { NbButtonModule, NbCardModule, NbInputModule, NbOptionModule, NbSelectModule, NbTreeGridModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { NbIconModule,NbTableModule } from '@nebular/theme';


@NgModule({
  imports: [
    ThemeModule,
    SendFaxRoutingModule,
    // MatTableModule,
    MatButtonModule,
    // CdkTableModule,
    MatSortModule,
    FileUploadModule,
    MatPaginatorModule,
    MatTabsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    Ng2CompleterModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule,
    NbIconModule,
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
export class SendFaxModule { }
