import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbDummyAuthProvider, NbEmailPassAuthProvider } from '@nebular/auth';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataModule } from './data/data.module';
import { AnalyticsService } from './utils/analytics.service';
import { HttpResponse , HttpErrorResponse} from '@angular/common/http';
import { getDeepFromObject } from '@nebular/auth/helpers';
import { NB_AUTH_TOKEN_WRAPPER_TOKEN, NbAuthJWTToken } from '@nebular/auth';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { environment } from '../../environments/environment';

const formSetting: any = {
  redirectDelay: 0,
  showMessages: {
    success: true,
  },
};

import { AppConfig } from '../app.config';

const NB_CORE_PROVIDERS = [
  ...DataModule.forRoot().providers,
  ...NbAuthModule.forRoot({
    providers: {
    email: {
        service: NbEmailPassAuthProvider,
        config: {
          baseEndPoint: '',
          login: {
            endpoint: environment.API_URL + '/authenticate',
            method: 'post',
          },
          register: {
            endpoint: '/auth/sign-up',
            method: 'post',
          },

          logout: {
             endpoint: environment.API_URL + '/authenticate/cancel',
             method: 'post',
           },

           requestPass: {
             endpoint: '/auth/request-pass',
             method: 'post',
           },
           resetPass: {
             endpoint: '/auth/reset-pass',
             method: 'post',
          },
          token: {
            key: 'token',
            getter: token_to_json,
          },
        },
      },
    },
    forms: {
      login: formSetting,
      register: formSetting,
      requestPassword: formSetting,
      resetPassword: formSetting,
      logout: {
        redirectDelay: 0,
      },
    },
  }).providers,
  AnalyticsService,
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

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
        { provide: NB_AUTH_TOKEN_WRAPPER_TOKEN, useClass: NbAuthJWTToken },
      ],
    };
  }
}
