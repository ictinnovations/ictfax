import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { Settings } from './default_settings';
import { DefaultSettingsService } from './default_settings.service';

@Component({
  selector: 'ngx-defaultsettings-component',
  templateUrl: './default_settings-component.html',
  styleUrls: ['./default_settings-component.scss'],
})

export class DefaultSettingsComponent implements OnInit {

  settings: Settings = new Settings;

  constructor(private router: Router, private def_service: DefaultSettingsService) { }

  ngOnInit() {
    /*
    this.getDefaultSettings();
    */
  }

  getDefaultSettings() {
    this.def_service.getDefConf().then(response => {
      this.settings = response;
    });
  }

  updateSettings() {
    this.router.navigate(['transmissions']);
  }
}
