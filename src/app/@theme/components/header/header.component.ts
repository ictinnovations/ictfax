import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  auser : any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [ { title: 'Change Password', link: '/pages/Changepass' }, { title: 'Log out', link: 'auth/logout' } ];

  image_url = "../../../../assets/images/ictfax-logo.png";


  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService, public translate: TranslateService,
              private breakpointService: NbMediaBreakpointsService, private authService: NbAuthService) {

                this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.auser = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable
          localStorage.setItem('username', this.auser.username);
          localStorage.setItem('is_admin', this.auser.is_admin);
          localStorage.setItem('aid', this.auser.user_id);
        }

      });
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
