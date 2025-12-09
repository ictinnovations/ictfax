import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken, getDeepFromObject } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import {
  AnalyticsService,
  LayoutService,
  PlayerService,
  SeoService,
  StateService,
} from './utils';

import { DashboardService } from '../pages/dashboard/dashboard.service';
import { AppService } from '../app.service';
import { CampaignService } from '../pages/campaigns/campaign.service';
import { TransmissionService } from '../pages/transmission/transmission.service';
import { ContactService } from '../pages/contact/contact.service';
import { GroupService } from '../pages/contact/group/group.service';
import { ExtensionService } from '../pages/extension/extension.service';
import { DocumentService } from '../pages/message/document/document.service';
import { AUserService } from '../pages/user/user.service';
import { ProviderService } from '../pages/provider/provider.service';
import { environment } from '../../environments/environment';
import { HttpResponse } from '@angular/common/http';
import { AuthGuard } from '../auth-guard.service';
import { DIDService } from '../pages/did/did.service';
import { SendFaxService } from '../pages/sendfax/sendfax.service';
import { InFaxService } from '../pages/infax/infax.service';
import { IncomingNumberService } from '../pages/incoming_number/incoming_number.service';

const socialLinks = [
  {
    url: 'https://github.com/akveo/nebular',
    target: '_blank',
    icon: 'github',
  },
  {
    url: 'https://www.facebook.com/akveo/',
    target: '_blank',
    icon: 'facebook',
  },
  {
    url: 'https://twitter.com/akveo_inc',
    target: '_blank',
    icon: 'twitter',
  },
];

const DATA_SERVICES = [

];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...DATA_SERVICES,
  ...NbAuthModule.forRoot({

    strategies: [
      NbPasswordAuthStrategy.setup({
        name: 'email',
        baseEndpoint: environment.API_URL ,
      requestPass:false,
      logout:{ 
        endpoint:'/authenticate/cancel',
        method:'post',
        redirect:{
          success:"/authen",
          failure: null,
        },
        requireValidToken:true,
      },
      resetPass:{
        endpoint:"auth/reset",
        redirect:{
          success:"/",
          failure:"/auth/login"
        }
      },
      refreshToken:{
        endpoint:'auth/refresh',
        method:"post"
      },
        login: {
          endpoint: '/authenticate',
          method:"post",
          redirect:{
            success:"/dashboard",
            failure: null,
          },
          requireValidToken:true
        },
        token: {
          class: NbAuthJWTToken,
          key:'token',
          getter: token_to_json 
        }
      }),
    ],
    forms: {
      login: {
        socialLinks: socialLinks,
      },
      register: {
        socialLinks: socialLinks,
      },
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
  LayoutService,
  PlayerService,
  SeoService,
  StateService,
  DashboardService,
  AppService,
  CampaignService,
  TransmissionService,
  ContactService,
  GroupService,
  ExtensionService,
  DocumentService,
  AUserService,
  ProviderService,
  AuthGuard,
  DIDService,
  SendFaxService,
  InFaxService,
  IncomingNumberService
];

export function token_to_json(module: string, res: HttpResponse<Object>) {
  return getDeepFromObject(res.body, 'token');
}

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders <CoreModule> {
    return{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
