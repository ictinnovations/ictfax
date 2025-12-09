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
import { Chart } from 'chart.js';

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
  refreshInterval: any;
  infax_total: any;
  outfax_total: any;
  user_total: any;
  did_total:any;
  customStart: string;
  customEnd: string;
  faxGraph: any;
  faxTotals: any = null;
  faxChart: any = null;
  faxDetails: any[] = [];
  selectedRange: string = 'daily';
  periodsMeta: any[] = [];
  selectedKey: string | null = null;

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
  systemHealth: any = null;
  servers: any[] = [];
  selectedServer: any = null;
  system: boolean = false;
  kpiData: any = {
  sent_today: 0,
  received_today: 0,
  success_rate: 0,
  failures_total: 0,
  queue_depth: 0,
  failures_reason: [],
  top_destinations: []
  };


  public outfax: any = true;
  public infax: any = false;
  public dids: any = false;
  public users: any = false;
  public kpi: boolean = false;
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
    this.getServers();
    this.loadFaxStats();
    this.loadData();
    this.refreshInterval = setInterval(() => {
    this.loadData();
   }, 600000);
  }

  ngOnDestroy() {
    this.alive = false;
  }


loadFaxStats() {
  this.dashboard_service.getFaxStatsV2(this.selectedRange).subscribe({
    next: (data) => {
      if (data?.success) {

        this.renderFaxChart(data);
        this.faxTotals = data.totals;
        this.periodsMeta = data.periods_meta;


        if (this.periodsMeta.length > 0) {
          const firstPeriodKey = this.periodsMeta[0].key;
          this.loadFaxDetails(firstPeriodKey);
        }
      }
    },
    error: (err) => console.error('Error loading fax stats:', err),
  });
}

renderFaxChart(data: any) {
      if (this.faxChart) {
        this.faxChart.destroy();
       }

  this.faxChart = new Chart('faxGraph', {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [


        {
          label: 'Failed',
          data: data.failed,
          type: 'bar',
         backgroundColor: 'rgba(255, 0, 0, 0.93)',
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointRadius: 0,
          order: 3,
        },
        {
          label: 'Received',
          data: data.received,
          type: 'bar',
         backgroundColor: 'rgba(0, 255, 17, 0.93)',
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointRadius: 0,
          order: 4,
        },

        {
          label: 'Success',
          data: data.success,
          type: 'bar',
         backgroundColor: 'rgba(11, 98, 248, 0.93)',
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointRadius: 0,
          order: 4,
        }

      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
          },
        },
      },
      interaction: { mode: 'nearest', intersect: false },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#444' },
        },
        y: {
          beginAtZero: true,
          grid: { color: '#eee' },
          ticks: { color: '#444' },
        },
      },
    },
  });
}


loadFaxDetails(periodKey: string) {
  this.dashboard_service.getFaxDetails(periodKey).subscribe({
    next: (details) => {
      if (details.success) {
        console.log('Fax details for period', periodKey, details.rows);

        this.faxDetails = details.rows;
      } else {
        console.error('Error fetching fax details:', details.error);
      }
    },
    error: (err) => console.error('Error loading fax details:', err),
  });
}

  changeRange(range: string) {
    this.selectedRange = range;
    this.loadFaxStats();
    this.faxDetails = [];
  }

getSuccessRateStatus(rate: number): string {
  if (rate >= 80) return 'success';
  if (rate >= 60) return 'warning';
  return 'danger';
}


  loadData(): void {
    this.runSystemHealthCheck();
    if (this.selectedServer) {
      this.selectServer(this.selectedServer);
    }
  }
runSystemHealthCheck() {
  this.dashboard_service.checkAllServersHealth().then(res => {
    if (res.status === "success") {
      console.log("Health check results:", res.results);

      this.getServers();
    }
  }).catch(err => {
    console.error("Error running system health check:", err);
    alert("Error: " + err.message);
  });
}


  getServers() {
    this.dashboard_service.getAllServersHealth().then(res => {
      if (res.status === "success") {
        this.servers = res.servers;
        if (!this.selectedServer && this.servers.length > 0) {
          this.selectServer(this.servers[0]);
        }
      }
    }).catch(err => {
      console.error("Error fetching servers:", err);
    });
  }

selectServer(server: any) {
  this.selectedServer = server;

  this.dashboard_service.getServerHealth(server.node_id).then(res => {
    if (res.status === "success" && res.history.length > 0) {
      // sort by checked_at DESC
      const sorted = res.history.sort(
        (a, b) => new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime()
      );

      const latest = sorted[0];

      this.systemHealth = {
        cpu: parseFloat(latest.cpu),
        ram: this.parseRam(latest.ram),
        disk: this.parseDisk(latest.disk),
        uptime: latest.uptime || 'N/A',
        processes: latest.processes || 'N/A',
        os: latest.os || 'N/A',
        version: latest.version || 'N/A',
        network: latest.network || { status: latest.status },
        lastUpdated: new Date() // client-side timestamp
      };
    }
  }).catch(err => {
    console.error("Error fetching server health:", err);
  });
}

parseRam(ramStr: string) {
  const match = /(\d+)\s*MB\s*\/\s*(\d+)\s*MB\s*\(([\d.]+)%\)/.exec(ramStr);
  return match ? {
    usage: parseFloat(match[3]),
    used: `${match[1]} MB`,
    total: `${match[2]} MB`
  } : { usage: 0, used: '0 MB', total: '0 MB' };
}

parseDisk(diskStr: string) {
  const match = /([\d.]+)\s*GB\s*\/\s*([\d.]+)\s*GB\s*\(([\d.]+)%\)/.exec(diskStr);
  return match ? {
    usage: parseFloat(match[3]),
    used: `${match[1]} GB`,
    total: `${match[2]} GB`
  } : { usage: 0, used: '0 GB', total: '0 GB' };
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

getCpuStatus(usage: number): string {
  if (usage > 90) return 'danger';
  if (usage > 70) return 'warning';
  return 'success';
}

getRamStatus(usage: number): string {
  if (usage > 85) return 'danger';
  if (usage > 65) return 'warning';
  return 'success';
}

getDiskStatus(usage: number): string {
  if (usage > 90) return 'danger';
  if (usage > 75) return 'warning';
  return 'success';
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
      this.aInFax = data
        .filter(fax => fax.direction === 'inbound')
        .sort((a, b) => b.transmission_id - a.transmission_id);
      this.infax_length = this.aInFax.length;
      this.aInFax.forEach(element => {
        if (element.contact_phone == null) {
          element.contact_phone = 'N/A';
        }
      });
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
