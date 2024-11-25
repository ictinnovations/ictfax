import { Component, OnInit, Inject } from '@angular/core';

// import { SocialAuthService } from "@abacritt/angularx-social-login";
// import { SocialUser } from "@abacritt/angularx-social-login";
// import { FacebookLoginProvider, GoogleLoginProvider } from "@abacritt/angularx-social-login";

import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, PopupRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SigninService } from './signin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent implements OnInit {
  // user: SocialUser;
  isLogin: boolean = false;
  isError: boolean = false;

  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  // // constructor(private socialAuthService: SocialAuthService) { }
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private router: Router,
    private broadcastService: MsalBroadcastService,
    private authService: MsalService,
    private signin_service: SigninService,
  ) { }

  ngOnInit() {
    // this.socialAuthService.authState.subscribe((user) => {
    //   this.user = user;
    //   this.loggedIn = (user != null);
    // }); 

    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.isLogin = true;
      // console.log(this.authService.instance.getAllAccounts()[0]);
      if (this.authService.instance.getAllAccounts()[0].name) {
        const email = this.authService.instance.getAllAccounts()[0].username;
        if(this.authService.instance.getAllAccounts()[0].name) {
          const name = this.authService.instance.getAllAccounts()[0].name.split(" ");
          const usr = {"first_name": name[0], "last_name": name[1], "email": email, "saml":true};
          // Validate User
          const user = this.signin_service.saml_login(usr).then(resp => {
            // console.log(resp);
            this.signin_service.get_payload(resp.token).then(data => {
              const token = {
                "name": "nb:auth:jwt:token",
                "ownerStrategyName": "email",
                "createdAt": data.iat,
                "value": resp.token
              }              
              localStorage.setItem('auth_app_token', JSON.stringify(token));
              localStorage.setItem('username', data.username ? data.username : "SAML");
              localStorage.setItem('is_admin', data.is_admin);
              localStorage.setItem('is_tenant', data.is_tenant);
              localStorage.setItem('aid', data.user_id);
              localStorage.setItem('tid', data.tenant_id);
              localStorage.setItem('permission', "");
              if (data.user_permission) localStorage.setItem('permission', data.user_permission);
              // this.router.navigate(['/dashboard']);
              window.location.replace("/pages/dashboard");
            });
          });
        } else {
          this.isError = true;
        }
      }
      // this.setLoginDisplay();
    })
  }

  login() {
    if (this.msalGuardConfig.authRequest){
      this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest);
    } else {
      this.authService.loginPopup();
    }
  }

  // setLoginDisplay() {    
  //   this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  // }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  // signInWithGoogle(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((result) => {
  //     console.log(result);
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }

  // signInWithFB(): void {
  //   this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((result)=>{
  //     console.log(this.user);
  //   }).catch((err)=>{
  //     console.log(err);
  //   })
  // }

}