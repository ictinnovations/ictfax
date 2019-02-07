import { Component, Input, OnInit, Injectable } from '@angular/core';
import {  NbAuthJWTToken, NbAuthService } from '@nebular/auth';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user: any;
  auser= {username: '', picture: ''};

  userMenu = [{ title: 'Log out', link: '/auth/logout' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private router: Router,
              private authService: NbAuthService) {
              this.authService.onTokenChange()
                .subscribe((token: NbAuthJWTToken,
                ) => {

                  if (token && token.getValue()) {
                    this.auser = token.getPayload();
                  }
                });
  }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  menuClick() {
    this.router.navigate(['auth/logout']);
  }
}
