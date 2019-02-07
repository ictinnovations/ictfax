import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Provider } from './provider';
import { ProviderService } from './provider.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'ngx-add-provider-component',
  templateUrl: './provider-form-component.html',
  styleUrls: ['./provider-form-component.scss'],
})

export class AddProviderComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private provider_service: ProviderService,
  private router: Router) { }


  form1: any= {};
  provider: Provider= new Provider;
  provider_id: any= null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.provider_id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.provider_service.get_ProviderData(this.provider_id).then(data => {
          this.provider = data;
        });
      }
    });
  }

  addProvider(): void {
    this.provider_service.add_Provider(this.provider).then(response => {
      this.router.navigate(['../../provider'], {relativeTo: this.route});
    });
  }

  updateProvider(): void {
    this.provider_service.update_Provider(this.provider).then(() => {
      this.router.navigate(['../../provider'], {relativeTo: this.route});
    })
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
