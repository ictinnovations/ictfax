import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { CampaignRoutingModule, routedComponents } from './campaign-routing.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { CampaignService } from './campaign.service';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NbCardModule, NbIconModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusCardComponent } from './status-card/status-card.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    CampaignRoutingModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    NbIconModule,
    TranslateModule
  ],
  declarations: [
    ...routedComponents,
    StatusCardComponent
  ],
})
export class CampaignModule { }
