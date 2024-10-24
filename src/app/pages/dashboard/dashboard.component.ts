import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { AUserService } from '../user/user.service';
import { UserDataSource } from '../user/user-datasource.component';
import { UserDatabase } from '../user/user-database.component';
import { DIDService } from '../did/did.service';
import { DIDDataSource } from '../did/did-datasource.component';
import { DIDDatabase } from '../did/did-database.component';
import { SendFaxService } from '../sendfax/sendfax.service';
import { SendFaxDataSource } from '../sendfax/sendfax-datasource.component';
import { SendFaxDatabase } from '../sendfax/sendfax-database.component';
import { InFaxDataSource } from '../infax/infax-datasource.component';
import { InFaxDatabase } from '../infax/infax-database.component';
import { InFaxService } from '../infax/infax.service';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { SendFax } from '../sendfax/sendfax';
import { DID } from '../did/did';
import { User } from '../user/user';
import { Transmission } from '../transmission/transmission';


interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  stat: any;

  infax_total: any;
  outfax_total: any;
  user_total: any;
  did_total:any;



  aUser: User[];
  UserDataSource: NbTreeGridDataSource<User>;
  aUser_page = [5, 10, 25, 100];
  aUser_pageSize = 10;
  aUser_startIndex: number = 0;
  aUser_currentPage: number;
  aUser_total_pages: number;
  aUser_minimumItems: number;
  aUser_items: any[] = [];
  user_length:any;
  displayedColumns= ['user_id', 'username', 'first_name', 'last_name', 'email'];
  
  
  aDID: DID[];
  DIDDataSource: NbTreeGridDataSource<DID>
  aDID_page = [5, 10, 25, 100];
  aDID_pageSize = 10;
  aDID_startIndex: number = 0;
  aDID_currentPage: number;
  aDID_total_pages: number;
  aDID_minimumItems: number;
  aDID_items: any[] = [];
  did_length: any;
  did_displayedColumns= ['phone', 'first_name'];
  
  aSendFax: SendFax[];
  SendFaxDatabaSource: NbTreeGridDataSource<SendFax>
  aSendFax_page = [5, 10, 25, 100];
  aSendFax_pageSize = 10;
  aSendFax_startIndex: number = 0;
  aSendFax_currentPage: number;
  aSendFax_total_pages: number;
  aSendFax_minimumItems: number;
  aSendFax_items: any[] = [];
  sendfax_length: any;
  senfax_displayedColumns= ['transmission_id', 'phone', 'Timestamp', 'username', 'status'];
  
  aInFax: Transmission[];
  InFaxDataSource: NbTreeGridDataSource<Transmission>;
  aInFax_page = [5, 10, 25, 100];
  aInFax_pageSize = 10;
  aInFax_startIndex: number = 0;
  aInFax_currentPage: number;
  aInFax_total_pages: number;
  aInFax_minimumItems: number;
  aInFax_items: any[] = [];
  infax_length: any;
  infax_displayedColumns= ['transmission_id', 'phone', 'status', 'Timestamp'];

  public outfax: any = true;
  public infax: any = false;
  public dids: any = false;
  public users: any = false;

  private alive = true;

  solarValue: number;
  lightCard: CardSettings = {
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'info',
      },
    ],
    dark: this.commonStatusCardsSet,
  };

  constructor(private themeService: NbThemeService, private dashboard_service: DashboardService,
  private dataSourceBuilderUser: NbTreeGridDataSourceBuilder<User>,
  private dataSourceBuilderDid: NbTreeGridDataSourceBuilder<DID>,
  private dataSourceBuilderSendFax: NbTreeGridDataSourceBuilder<SendFax>,
  private InFaxDataSourceBuilder: NbTreeGridDataSourceBuilder<Transmission>,
  public router: Router, private user_service: AUserService, private did_service: DIDService, private sendfax_service: SendFaxService
  ,private infax_service: InFaxService) {

    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
    });

  }

  ngOnInit() {
    this.getStat();
    this.getUserlist();
    this.getDIDlist();
    this.getFaxlist();
    this.getInFaxList();
    this.get_didStat();
    this.fax_stat();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  getStat(): void {
    this.dashboard_service.get_Statistics().then(response => {
    this.stat = response;

    const infax_tot = this.abbreviateNumber(this.stat.transmission_inbound);
    const users_total = this.abbreviateNumber(this.stat.user_total);
    this.infax_total = infax_tot;
    this.user_total = users_total;
    });
  }

  abbreviateNumber(value) {
    let newValue = value;
    if (value >= 1000) {
      const suffixes = ['', 'k', 'm', 'b', 't'];
      const suffixNum = Math.floor( ('' + value).length / 3 );
      let shortValue: any;
      let shortNum: any;
      for (let precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat( (suffixNum !== 0 ? (value / Math.pow(1000, suffixNum) ) : value).toPrecision(precision));
        const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
        if (dotLessShortValue.length <= 2) { break; }
      }
      if (shortValue % 1 !== 0) {
        shortNum = shortValue.toFixed(1);
        newValue = shortValue + suffixes[suffixNum];
      }
    }
    return newValue;
  }

  getUserlist() {
    this.user_service.get_UserList().then(data => {
      this.aUser = data.sort((a, b) => b.user_id - a.user_id);
      this.user_length = data.length;

      this.getpaginateUser(this.aUser_pageSize);
      this.UserDataSource = this.dataSourceBuilderUser.create(this.aUser_items.map(item => ({ data: item })),);
      
    })
  }
  getpaginateUser(page_Items: string | number) {
    if (typeof page_Items === 'string') {
      if (page_Items === 'next') {
        if (this.aUser_startIndex + this.aUser_pageSize < this.user_length) {
          this.aUser_startIndex += this.aUser_pageSize; 
        }
      } else if (page_Items === 'previous') {
        if (this.aUser_startIndex > 0) {
          this.aUser_startIndex -= this.aUser_pageSize;
        }
      }
    } else {
      this.aUser_pageSize = page_Items;
      this.aUser_startIndex = 0; 
    }
    this.aUser_currentPage = Math.floor(this.aUser_startIndex / this.aUser_pageSize) + 1;
    this.aUser_total_pages = Math.ceil(this.user_length / this.aUser_pageSize);
    this.aUser_minimumItems = Math.min(this.aUser_startIndex + this.aUser_pageSize, this.user_length);    
    
    const end = Math.min(this.aUser_startIndex + this.aUser_pageSize, this.user_length);
    this.aUser_items = this.aUser.slice(this.aUser_startIndex, end); 
    this.UserDataSource = this.dataSourceBuilderUser.create(this.aUser_items.map(item => ({ data: item })));
  }
  
  getDIDlist() {
    this.did_service.get_DIDList().then(data => {
      this. aDID = data.sort((a, b) => b.phone - a.phone);
      this.did_length = data.length;

      this.getpaginateDID(this.aDID_pageSize);
      this.DIDDataSource = this.dataSourceBuilderDid.create(this.aDID_items.map(Item => ({ data: Item})),);

    });
  }

  getpaginateDID(page_Items: string | number) {
    if (typeof page_Items === 'string') {
      if (page_Items === 'next') {
        if (this.aDID_startIndex + this.aDID_pageSize < this.did_length) {
          this.aDID_startIndex += this.aDID_pageSize; 
        }
      } else if (page_Items === 'previous') {
        if (this.aDID_startIndex > 0) {
          this.aDID_startIndex -= this.aDID_pageSize;
        }
      }
    } else {
      this.aDID_pageSize = page_Items;
      this.aDID_startIndex = 0; 
    }
    this.aDID_currentPage = Math.floor(this.aDID_startIndex / this.aDID_pageSize) + 1;
    this.aDID_total_pages = Math.ceil(this.did_length / this.aDID_pageSize);
    this.aDID_minimumItems = Math.min(this.aDID_startIndex + this.aDID_pageSize, this.did_length);    
    
    const end = Math.min(this.aDID_startIndex + this.aDID_pageSize, this.did_length);
    this.aDID_items = this.aDID.slice(this.aDID_startIndex, end); 
    this.DIDDataSource = this.dataSourceBuilderDid.create(this.aDID_items.map(item => ({ data: item })));
  }

  getFaxlist() {
    this.sendfax_service.get_OutFaxTransmissionList().then(data => {
      
      this.aSendFax = data.sort((a, b) => b.transmission_id - a.transmission_id);
      this.sendfax_length = data.length;
      // this.sendfax_length = data?.length;


      data.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      })
      this.getpaginateSendFax(this.aSendFax_pageSize);
      this.SendFaxDatabaSource = this.dataSourceBuilderSendFax.create(this.aSendFax_items.map(Item => ({ data: Item })));


    })
  }

  getpaginateSendFax(page_Items: string | number) {
  //   if (!Array.isArray(this.aSendFax)) {
  //     console.error("aSendFax is not an array or is undefined.");
  //     return;
  // }
    if (typeof page_Items === 'string') {
      if (page_Items === 'next') {
        if (this.aSendFax_startIndex + this.aSendFax_pageSize < this.sendfax_length) {
          this.aSendFax_startIndex += this.aSendFax_pageSize; 
        }
      } else if (page_Items === 'previous') {
        if (this.aSendFax_startIndex > 0) {
          this.aSendFax_startIndex -= this.aSendFax_pageSize;
        }
      }
    } else {
      this.aSendFax_pageSize = page_Items;
      this.aSendFax_startIndex = 0; 
    }
    this.aSendFax_currentPage = Math.floor(this.aSendFax_startIndex / this.aSendFax_pageSize) + 1;
    this.aSendFax_total_pages = Math.ceil(this.sendfax_length / this.aSendFax_pageSize);
    this.aSendFax_minimumItems = Math.min(this.aSendFax_startIndex + this.aSendFax_pageSize, this.sendfax_length);    
    
    const end = Math.min(this.aSendFax_startIndex + this.aSendFax_pageSize, this.sendfax_length);
    this.aSendFax_items = this.aSendFax.slice(this.aSendFax_startIndex, end); 
    this.SendFaxDatabaSource = this.dataSourceBuilderSendFax.create(this.aSendFax_items.map(item => ({ data: item })));
  }

  getInFaxList() {
    this.infax_service.get_InFaxTransmissionList().then(data => {
      this.aInFax = data.sort((a, b) => b.transmission_id - a.transmission_id);
      this.infax_length = data.length;

      data.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      })
      this.getpaginateInFax(this.aInFax_pageSize)
      this.InFaxDataSource = this.InFaxDataSourceBuilder.create(this.aInFax_items.map(Item => ({ data: Item })),);

    });
  }

  
  getpaginateInFax(page_Items: string | number) {
  //   if (!Array.isArray(this.aInFax)) {
  //     console.error("aInFax is not an array or is undefined.");
  //     return;
  // }
    if (typeof page_Items === 'string') {
      if (page_Items === 'next') {
        if (this.aInFax_startIndex + this.aInFax_pageSize < this.infax_length) {
          this.aInFax_startIndex += this.aInFax_pageSize; 
        }
      } else if (page_Items === 'previous') {
        if (this.aInFax_startIndex > 0) {
          this.aInFax_startIndex -= this.aInFax_pageSize;
        }
      }
    } else {
      this.aInFax_pageSize = page_Items;
      this.aInFax_startIndex = 0; 
    }
    this.aInFax_currentPage = Math.floor(this.aInFax_startIndex / this.aInFax_pageSize) + 1;
    this.aInFax_total_pages = Math.ceil(this.infax_length / this.aInFax_pageSize);
    this.aInFax_minimumItems = Math.min(this.aInFax_startIndex + this.aInFax_pageSize, this.infax_length);    
    
    const end = Math.min(this.aInFax_startIndex + this.aInFax_pageSize, this.infax_length);
    this.aInFax_items = this.aInFax.slice(this.aInFax_startIndex, end); 
    this.InFaxDataSource = this.InFaxDataSourceBuilder.create(this.aInFax_items.map(item => ({ data: item })));
  }

  get_didStat() {
    this.dashboard_service.get_didStat().then(res => {
      const did_total = this.abbreviateNumber(res.did_total);
      this.did_total = did_total;
    })
  }

  fax_stat() {
    this.dashboard_service.get_outFaxStat().then(res => {
      const tr_out = this.abbreviateNumber(res.transmission_outbound);
      this.outfax_total = tr_out;
    })
  }

  cardClick(a) {
    if (a == 'infax') {
      this.infax = true;
      this.outfax = false;
      this.dids = false;
      this.users = false;
    }
    else if (a == 'outfax') {
      this.outfax = true;
      this.infax = false;
      this.dids = false;
      this.users = false;
    }
    else if (a == 'dids') {
      this.dids = true;
      this.outfax = false;
      this.infax = false;
      this.users = false;
    }
    else if (a == 'users') {
      this.users = true;
      this.outfax = false;
      this.dids = false;
      this.infax = false;
    }
  }

}
