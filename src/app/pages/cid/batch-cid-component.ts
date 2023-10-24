import { Component, OnInit, ViewChild } from '@angular/core';
import { CID } from './cid';
import { CIDService } from './cid.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-batch-cid-component',
  templateUrl: './batch-cid-component.html',
  styleUrls: ['./batch-cid-component.scss'],
})

export class BatchCIDComponent {

  constructor(private cid_service: CIDService, private router: Router, private route: ActivatedRoute) {
    this.cid.active = 1;
  }

  cid: CID= new CID;

  addCID() {
    for (let i = this.cid.range_from; i <= this.cid.range_to; i++) {
      this.cid.phone = i;
      this.cid.username = this.cid.phone;
      this.cid.first_name = this.cid.title + ' ' + i;
      this.cid_service.add_CID(this.cid).then(response => {
      });
      if ( i == this.cid.range_to) {
        this.router.navigate(['../../cid'], {relativeTo: this.route});
      }
    }
  }
}

