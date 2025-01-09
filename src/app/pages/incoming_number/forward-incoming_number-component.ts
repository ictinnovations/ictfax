import { Component, OnInit, NgModule, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Http, HttpModule, Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { IncomingNumber } from './incoming_number';
import { IncomingNumberService } from './incoming_number.service';
import { DIDService } from '../did/did.service';
import { ExtensionService } from '../extension/extension.service';
import { AUserService } from '../user/user.service';
import { User } from '../user/user';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'ngx-forward-incoming-component',
  templateUrl: './forward-incoming_number-component.html',
  styleUrls: ['./forward-incoming_number-component.scss'],
})

export class ForwardIncomingNumberComponent implements OnInit {

  constructor(private http: Http, private route: ActivatedRoute, private in_number_service: IncomingNumberService,
  private router: Router, private did_service: DIDService, private user_service: AUserService, private ext_service: ExtensionService) { }


  form1: any= {};
  incomingNumber: IncomingNumber= new IncomingNumber;
  id: any= null;
  exts: any = [];
  user: User = new User;
  user_id: any = null;
  accounts: any = null;
  accountsData: any = [];
  foundAccounts: any = [];
  deletedAccounts: any = [];
  newAccounts: any = [];

  ngOnInit(): void {
    this.getAllExt();
    this.route.params.subscribe(params => {
      this.user_id = localStorage.getItem('aid');
      this.getUserData(this.user_id);
      this.id = +params['id'];
      const test_url = this.router.url.split('/');
      const lastsegment = test_url[test_url.length - 1];
      if (lastsegment === 'new') {
        return null;
      } else {
        return this.in_number_service.get_Data(this.id).then(data => {
          this.incomingNumber = data;
          this.incomingNumber.service_name = '';
        });
      }
    });
  }

  getAllExt() {
    this.ext_service.get_ExtensionList().then(response => {
      this.exts = response;
    });
  }
  getUserData(user_id = null) {
    this.user_service.get_UserData(user_id).then(response => {
      this.user = response;
      // Users accounts
      if (this.user.user_id) {
        this.user_service.get_UserAccounts(this.id).then(data => {
          if (data.length) {
            data.forEach(item => {
              if (item.email) {
                this.accountsData.push(item);
                this.foundAccounts.push(item.email);
              }
            });
            this.accounts = this.foundAccounts.join('\n');
          }
        });
      }
    });
  }
  updateAccounts(): void {
    // Collect emails
    let accountsArray = Array.from(new Set(this.accounts.split('\n')));
    // Filter valid emails
    let validEmails = accountsArray.filter(this.isValidEmail);
    // Filter new accounts
    this.newAccounts = validEmails.filter(item => !this.foundAccounts.includes(item));
    // Filter deleted accounts
    this.deletedAccounts = this.foundAccounts.filter(item => !validEmails.includes(item));
    // Delete accounts
    if (this.deletedAccounts.length > 0) {
      // let foundIds = this.foundAccounts.filter(obj => this.deletedAccounts.includes(obj.email)).map(obj => obj.account_id);
      let deletedAccountIds = this.accountsData.filter(account => this.deletedAccounts.includes(account.email)).map(account => account.account_id);
      // Send delete query
      deletedAccountIds.forEach(accountId => {
        this.user_service.get_DeleteAccount(accountId).then(data => {});
      });
    }
    // Add accounts
    this.newAccounts.forEach(email => {
      // Setup account
      const account = {
        type: 'account',
        username: Math.floor(Math.random() * (999 - 100 + 1)) + 100 + ' ' + email, //.split('@')[0],
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        phone: this.user.phone,
        email: email,
        linkdid_id : this.id,
        address: this.user.address,
        company: this.user.company,
        active: this.user.active,
      }
      // Add account
      this.user_service.add_Account(account).then(account_id => {
        return true;
      });
    });
    // Redirect to users page
    this.router.navigate(['../../'], {relativeTo: this.route});
  }
  isValidEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
  }

  forwardDID(): void {
    if (this.incomingNumber.service_name == 'no_service' ) {
      this.did_service.no_service(this.incomingNumber.account_id).then(response => {
        this.router.navigate(['../../../incoming_number'], {relativeTo: this.route});
      });
    } else if (this.incomingNumber.service_name == 'faxtoemail' ) {
      if (this.incomingNumber.email == null || this.incomingNumber.email == undefined) {
        this.did_service.send_program(this.incomingNumber).then(response => {
          this.router.navigate(['../../../incoming_number'], {relativeTo: this.route});
        });
      } else {
        this.in_number_service.update_account(this.incomingNumber).then(data => {
          this.did_service.send_program(this.incomingNumber).then(response => {
            this.router.navigate(['../../../incoming_number'], {relativeTo: this.route});
          });
        })  
      }
    } else if (this.incomingNumber.service_name == 'forwardtoext' ) {
        this.incomingNumber.did_id = this.incomingNumber.account_id;
        this.in_number_service.forwardtoext(this.incomingNumber).then(response => {
          this.router.navigate(['../../../incoming_number'], {relativeTo: this.route});
        });
      }  
      else {
    }
    this.updateAccounts();

  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
