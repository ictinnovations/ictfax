import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { UserRoutingModule, routedComponents } from './user-routing.module';
import { FormsUserComponent } from './user-component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { AUserService } from './user.service';
import { MatSortModule, MatPaginator } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { EqualValidator } from './password.match.directive';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

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
    DropDownsModule,
  ],
  declarations: [
    EqualValidator,
    ...routedComponents,
  ],
})
export class UserModule { }

