import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { AppService } from '../../app.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';


@Component({
  selector: 'ngx-handler',
  template: `<div class="row">
               <div class="col-md-12">
                 <nb-card>
                   <nb-card-body>
                     <div class="flex-centered col-xl-4 col-lg-6 col-md-8 col-sm-12">
                       <h2 class="title">Internal Server Error</h2>
                       <small class="sub-title">The server encountered an internal error or misconfiguration and
                        was unable to complete your request.</small>
  	                   <button (click)="goToHome()" type="button" class="btn btn-block btn-hero-primary">
  	                     Take me home
  	                   </button>
  	                 </div>
  	               </nb-card-body>
  	            </nb-card>
  	          </div>
  	       </div>`,
  styleUrls: ['./error-handler.component.scss'],
})
export class ErrorComponent {

  constructor(private router: Router) { }

  goToHome() {
    this.router.navigate(['transmissions']);
  }

}
