/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-app',
  template: `
    
    <router-outlet></router-outlet>
      
  `,
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private seoService: SeoService, public translate :TranslateService) {
    translate.addLangs(['english', 'japanese', 'italian']);
    translate.setDefaultLang('english');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/english|japanese/) ? browserLang : 'english');
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }
}
