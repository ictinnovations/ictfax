import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ErrorModule } from './error-handler/error-handler.module';
import { DefaultSettingsModule } from './default_settings/default_settings.module';
import { InFaxModule } from './infax/infax.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TransmissionModule } from '../pages/transmission/transmission.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    TransmissionModule,
    ErrorModule,
    DefaultSettingsModule,
    InFaxModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
