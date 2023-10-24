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
import { FaxSettingsModule } from './faxsettings/faxsettings.module';
import { IncomingCIDNumberModule } from './incoming_cid_number/incoming_cid_number.module';


@NgModule({
  imports: [
    IncomingCIDNumberModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    TransmissionModule,
    DefaultSettingsModule,
    InFaxModule,
    ChangePasswordModule,
    IncomingCIDNumberModule,
    FaxSettingsModule
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
