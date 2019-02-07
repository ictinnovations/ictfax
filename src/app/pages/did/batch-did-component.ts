import { Component, OnInit, ViewChild } from '@angular/core';
import { DID } from './did';
import { DIDService } from './did.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-batch-did-component',
  templateUrl: './batch-did-component.html',
  styleUrls: ['./batch-did-component.scss'],
})

export class BatchDIDComponent {

  constructor(private did_service: DIDService, private router: Router, private route: ActivatedRoute) {
    this.did.active = 1;
  }

  did: DID= new DID;

  addDID() {
    for (let i = this.did.range_from; i <= this.did.range_to; i++) {
      this.did.phone = i;
      this.did.username = this.did.phone;
      this.did.first_name = this.did.title + ' ' + i;
      this.did_service.add_DID(this.did).then(response => {
      });
      if ( i == this.did.range_to) {
        this.router.navigate(['../../did'], {relativeTo: this.route});
      }
    }
  }
}

