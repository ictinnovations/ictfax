import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { AppService } from '../app.service';
import { Observable } from 'rxjs/Observable';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';

import { MENU_ITEMS } from './pages-menu';
import { userMenuItems } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet>
        <div *ngIf="err_val && err_val.length > 0" class="alert alert-danger" role="alert" style="text-align:center">
          <div><strong>Oh snap!</strong></div>
          <div>{{ err_val }}</div>
        </div>

        <div *ngIf="messg_val && messg_val.length > 0" class="alert alert-success" role="alert">
          <div><strong>Hooray!</strong></div>
          <div>{{ messg_val }}</div>
        </div>
      </router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;
  err_val: string;
  messg_val: string;
  auser: any;

  constructor(private app_service: AppService, private authService: NbAuthService) {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken,
    ) => {
      if (token && token.getValue()) {
        this.auser = token.getPayload();
        if (this.auser.is_admin == 0) {
          this.menu = userMenuItems;
        }
      }
    });
  }

  ngOnInit() {
    this.err_val = this.app_service.errors;

  }

  ngDoCheck() {
    this.err_val = this.app_service.errors;
    let mymenu:any = localStorage.getItem('is_admin');
    if (mymenu != undefined && (mymenu == '0' || mymenu == 0) ) {
      this.menu = userMenuItems;
    }
    else if (mymenu != undefined && (mymenu == '1' || mymenu == 1)) {
      this.menu = MENU_ITEMS;
    }
    else {

    }
  }

}
