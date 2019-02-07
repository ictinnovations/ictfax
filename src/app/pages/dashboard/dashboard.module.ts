import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { TeamComponent } from './team/team.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
    RouterModule,

  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent,

    TeamComponent,
  ],
})
export class DashboardModule { }
