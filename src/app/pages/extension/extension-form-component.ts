import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Extension, Settings } from './extension';
import { ExtensionService } from './extension.service';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'ngx-add-extension-component',
  templateUrl: './extension-form-component.html',
  styleUrls: ['./extension-form-component.scss'],
})


export class AddExtensionComponent implements OnInit {

  constructor(private route: ActivatedRoute, private account_service: ExtensionService,
  private router: Router) { }


  // form1: any= {};
  extension: Extension= new Extension;
  account_id: any= null;
  form: FormGroup;

  settings: Settings = new Settings;
  public sendbody: any = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.account_id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.account_service.get_ExtensionData(this.account_id).then(data => {
          this.extension = data;
          this.fetch_settings();
        });
      }
    });
  }

  addExtension(): void {
    this.extension.type = 'extension';
    this.account_service.add_Extension(this.extension).then(response => {
      if (this.sendbody == true) {
        this.updateSettings(response);
      }
      else {
        this.deleteSettings(response);

      }
      this.router.navigate(['../../extension'], {relativeTo: this.route});
    });
  }

  updateExtension(): void {
    this.account_service.update_Extension(this.extension).then(() => {
      if (this.sendbody == true) {
        this.updateSettings(this.extension.account_id);
      }
      else {
        this.deleteSettings(this.extension.account_id);

      }
      this.router.navigate(['../../extension'], {relativeTo: this.route});
    })
    .catch(this.handleError);
  }

  fetch_settings() {
    this.account_service.get_Settings(this.extension.account_id).then(response => {
      this.sendbody = response;
    })
    .catch(err => this.handleError(err));
  }

  updateSettings(account_id) {
    this.settings.value = 'body';
    this.account_service.update_Settings(account_id,this.settings).then(data => {
    })
    .catch(this.handleError);
  }

  deleteSettings(account_id) {
    this.account_service.delete_Settings(account_id).then(data => {
    })
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
