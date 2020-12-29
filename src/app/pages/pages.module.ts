import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DefaultSettingsModule } from './default_settings/default_settings.module';
import { InFaxModule } from './infax/infax.module';
import { ChangePasswordModule } from './changepassword/changepassword.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { TransmissionModule } from './transmission/transmission.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    TransmissionModule,
    DefaultSettingsModule,
    InFaxModule,
    ChangePasswordModule
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
