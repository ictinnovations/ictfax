import { Component, OnInit } from '@angular/core';
import { ContactDNC } from './contact_dnc';
import { Http } from '@angular/http';
import { ContactDNCService } from './contact_dnc.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { FileUploader } from 'ng2-file-upload';
import { AppService } from '../../app.service';

@Component({
  selector: 'ngx-add-contact_dnc-component',
  templateUrl: './contact_dnc-form-component.html',
  styleUrls: ['./contact_dnc-form-component.scss'],
})
export class AddContactDNCComponent implements OnInit {
  contact_dnc: ContactDNC = new ContactDNC;
  contact_dnc_id: any = null;
  form1: any = {};
  isError = false;
  file: any;
  errorText: any = [];



  constructor(private http: Http, private contact_dnc_service: ContactDNCService, private router: Router, private route: ActivatedRoute, private app_service: AppService) { }



  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contact_dnc_id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.contact_dnc_service.get_ContactDNCData(this.contact_dnc_id).then(data => {
          this.contact_dnc = data;
        });
      }
    });
  }

  addContactDNC(): void {
    this.checkFields();
    if (this.errorText.length === 0) {
      this.contact_dnc_service.add_ContactDNC(this.contact_dnc).then(response => {
        this.router.navigate(['../../contact_dnc'], {relativeTo: this.route});
      });
    }else{
      this.errorHandler(true, this.errorText);
    }
  }

  updateContactDNC(): void {
    this.checkFields();
    if (this.errorText.length === 0) {
      this.contact_dnc_service.update_ContactDNC(this.contact_dnc).then(() => {
        this.router.navigate(['../../contact_dnc'], { relativeTo: this.route });
      });
    } else {
      this.errorHandler(true, this.errorText);
    }
  }

  private checkFields(status = null): any {
    this.errorHandler(false, [])
    if (!this.contact_dnc.phone) this.errorText.push("Phone is required.");
  }

  private errorHandler(status, message): any {
    this.isError = status;
    this.errorText = message;
    if (status) {
      setTimeout(() => {
        this.isError = false;
        this.errorText = [];
      }, 10000);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}