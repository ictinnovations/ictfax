import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ContactService } from '../../pages/contact/contact.service';
import { DocumentService } from '../../pages/message/document/document.service';
import { TransmissionService } from '../../pages/transmission/transmission.service';
import { ProviderService } from '../../pages/provider/provider.service';
import { AppService } from '../../../app/app.service';
import { AUserService } from '../../pages/user/user.service';
import { AuthGuard } from '../../auth-guard.service';
import { DashboardService } from '../../pages/dashboard/dashboard.service';
import { IncomingNumberService } from '../../pages/incoming_number/incoming_number.service';
import { InFaxService } from '../../pages/infax/infax.service';
import { DIDService } from '../../pages/did/did.service';
import { DefaultSettingsService } from '../../pages/default_settings/default_settings.service';
import { ExtensionService } from '../../pages/extension/extension.service';
import { SendFaxService } from '../../pages/sendfax/sendfax.service';

const SERVICES = [
  ContactService,
  DocumentService,
  TransmissionService,
  ProviderService,
  AppService,
  AUserService,
  DashboardService,
  IncomingNumberService,
  InFaxService,
  DIDService,
  DefaultSettingsService,
  ExtensionService,
  SendFaxService
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class DataModule {
 
}
