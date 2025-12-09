import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { UserRoutingModule, routedComponents } from './user-routing.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule } from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { EqualValidator } from './password.match.directive';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbOptionModule, NbSelectModule, NbTreeGridModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    ThemeModule,
    UserRoutingModule,
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
    MatInputModule,
    MatFormFieldModule,
    NbIconModule,
    TranslateModule,
    NbButtonModule,
    NbInputModule,
    NbTreeGridModule,
    NbSelectModule,
    NbOptionModule
  ],
  declarations: [
    EqualValidator,
    ...routedComponents,
  ],
})
export class UserModule { }

