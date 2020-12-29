import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { UserRoutingModule, routedComponents } from './user-routing.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule, MatIconModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { EqualValidator } from './password.match.directive';
import { NbCardModule, NbIconModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    NbIconModule
  ],
  declarations: [
    EqualValidator,
    ...routedComponents,
  ],
})
export class UserModule { }

