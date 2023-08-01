import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { AppService } from '../app.service';
import { Observable } from 'rxjs/Observable';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { TranslateService , LangChangeEvent} from '@ngx-translate/core';
import { MENU_ITEMS } from './pages-menu';
import { userMenuItems } from './pages-menu';
import { MenuItem } from './menu-item';

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

  constructor(private app_service: AppService, private authService: NbAuthService, public translate :TranslateService) {
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
    this.messg_val = this.app_service.success_message;
    this.translateMenu();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => { //Live reload
      this.translateMenu();
    });
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

  private translateMenu(): void {
    this.menu.forEach((menuItem: MenuItem) => {
      this.translateMenuTitle(menuItem);
    });
  }

  /**
     * Translates one root menu item and every nested children
     * @param menuItem
     * @param prefix
     */
    private translateMenuTitle(menuItem: MenuItem, prefix: string = ''): void {
      
      let key = '';
      try {
        key = (prefix !== '')
        ? PagesComponent.getMenuItemKey(menuItem, prefix)
        : PagesComponent.getMenuItemKey(menuItem);
      }
      catch (e) {
          //Key not found, don't change the menu item
          return;
      }

      this.translate.get(key).subscribe((translation: string) => {
          menuItem.title = translation;
      });
      if (menuItem.children != null) {
          //apply same on every child
          menuItem.children.forEach((childMenuItem: MenuItem) => {
              //We remove the nested key and then use it as prefix for every child
              this.translateMenuTitle(childMenuItem, PagesComponent.trimLastSelector(key));
          });
      }
  }

  /**
   * Resolves the translation key for a menu item. The prefix must be supplied for every child menu item
   * @param menuItem
   * @param prefix
   * @returns {string}
   */
  private static getMenuItemKey(menuItem: MenuItem, prefix: string = 'menu'): string {
      if (menuItem.key == null) {
          throw new Error('Key not found');
      }

      const key = menuItem.key.toLowerCase();
      if (menuItem.children != null) {
          return prefix + '.' + key + '.' + key; //Translation is nested
      }
      return prefix + '.' + key;
  }

  /**
   * Used to remove the nested key for translations
   * @param key
   * @returns {string}
   */
  private static trimLastSelector(key: string): string {
      const keyParts = key.split('.');
      keyParts.pop();
      return keyParts.join('.');
  }

}



