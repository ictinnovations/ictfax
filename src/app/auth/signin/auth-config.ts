import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;
 
export const b2cPolicies = {
     names: {
         signUpSignIn: "B2X_1_ICT_SAML"
     },
     authorities: { 
         signUpSignIn: {
            //  authority: "https://kashifictinnovations.b2clogin.com/kashifictinnovations.onmicrosoft.com/b2c_1_susi_reset_v2",
            authority: "https://login.microsoftonline.com/common/"
         }
     },
     authorityDomain: "kashifictinnovations.b2clogin.com"
 };
 
 
export const msalConfig: Configuration = {
     auth: {
         clientId: '1f1fe062-d01f-4592-9f73-4e313fe87910',
         authority: b2cPolicies.authorities.signUpSignIn.authority,
         knownAuthorities: [b2cPolicies.authorityDomain],
        //  redirectUri: 'https://demo12.ictfax.com/auth', 
        redirectUri: 'http://localhost:4200/auth', 
     },
     cache: {
         cacheLocation: BrowserCacheLocation.LocalStorage,
         storeAuthStateInCookie: isIE, 
     },
     system: {
         loggerOptions: {
            loggerCallback: (logLevel, message, containsPii) => {
                // console.log(message);
             },
             logLevel: LogLevel.Verbose,
             piiLoggingEnabled: false
         }
     }
 }

export const protectedResources = {
  todoListApi: {
    endpoint: "api://ictfax",
    scopes: ["api://ictfax/read"],
  },
}
export const loginRequest = {
  scopes: []
};