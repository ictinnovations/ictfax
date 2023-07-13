import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { AUserService } from '../user/user.service';
import { UserDataSource } from '../user/user-datasource.component';
import { UserDatabase } from '../user/user-database.component';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
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


  user_length:any;
  aUser: UserDataSource | null;

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  displayedColumns= ['ID', 'username', 'first_name', 'last_name', 'email'];

  did_displayedColumns= ['phone', 'first_name'];

  aDID: DIDDataSource | null;
  did_length: any;

  aSendFax: SendFaxDataSource | null;
  sendfax_length: any;

  senfax_displayedColumns= ['ID', 'phone', 'Timestamp', 'username', 'status'];

  aInFax: InFaxDataSource | null;
  infax_length: any;

  infax_displayedColumns= ['ID', 'phone', 'status', 'Timestamp'];

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
      this.user_length = data.length;
      this.aUser = new  UserDataSource(new UserDatabase( data ), this.sort, this.paginator);

      //Sort the data automatically

      const sortState: Sort = {active: 'ID', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    })
  }
  
  getDIDlist() {
    this.did_service.get_DIDList().then(data => {
      this.did_length = data.length;
      this.aDID = new  DIDDataSource(new DIDDatabase( data ), this.sort, this.paginator);
    });
  }

  getFaxlist() {
    this.sendfax_service.get_OutFaxTransmissionList().then(data => {
      this.sendfax_length = data.length;

      data.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      })   
      this.aSendFax = new SendFaxDataSource(new SendFaxDatabase( data ), this.sort, this.paginator);
    })
  }
  
  getInFaxList() {
    this.infax_service.get_InFaxTransmissionList().then(data => {
      this.infax_length = data.length;

      data.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      })

      this.aInFax = new InFaxDataSource(new InFaxDatabase( data ), this.sort, this.paginator);
    });
  }

  get_didStat() {
    this.dashboard_service.get_didStat().then(res => {
      const did_total = this.abbreviateNumber(res.account_total);
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
