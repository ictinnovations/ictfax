import { Component, OnInit, ViewChild } from '@angular/core';
import { CampaignService } from './campaign.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CampaignDatabase } from './campaign-database.component';
import { CampaignDataSource } from './campaign-datasource.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable, timer } from 'rxjs';
import { ModalComponent } from '../../modal.component';



@Component({
  selector: 'ngx-campaign-component',
  templateUrl: './campaign-component.html',
  styleUrls: ['./campaign-component.scss'],
})


export class FormsCampaignComponent implements OnInit {

  constructor(private campaign_service: CampaignService, private modalService: NgbModal) { }

  aCampaign: CampaignDataSource | null;
  length: number;
  private timerSubscription: any;
  closeResult: any;

  displayedColumns= ['ID', 'ID1', 'name', 'status', 'total', 'done', 'Operations'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  ngOnInit() {
    this.getCampaignlist();
  }

  getCampaignlist() {
    this.campaign_service.get_CampaignList().then(data => {
      this.length = data.length;
      this.aCampaign = new CampaignDataSource(new CampaignDatabase( data ), this.sort, this.paginator);
    });
  }

  deleteCampaign(campaign_id): void {
    this.campaign_service.delete_Campaign(campaign_id).then(response => {
    })
    .catch(this.handleError);
    this.getCampaignlist();
  }

  startCampaign(campaign_id): void {
    this.campaign_service.start_campaign(campaign_id).then(response => {
      this.refreshData();
    });
  }

  private refreshData(): void {
    this.campaign_service.get_CampaignList().then(data => {
      this.length = data.length;
      this.aCampaign = new CampaignDataSource(new CampaignDatabase( data ), this.sort, this.paginator);
      this.subscribeToData();
    });
  }

  private subscribeToData(): void {
    this.timerSubscription = timer(5000).first().subscribe(() => this.refreshData());
  }

  stopCampaign(campaign_id): void {
    this.campaign_service.stop_campaign(campaign_id).then(response => {
    });
  }

  // Modal related
  showStaticModal(campaign_id) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      container: 'nb-layout',
    });

    activeModal.componentInstance.modalHeader = 'Alert';
    activeModal.componentInstance.modalContent = `Are you sure you want to delete this?`;
    activeModal.result.then((result) => {
      this.closeResult = result;
      if (this.closeResult === 'yes_click') {
        this.deleteCampaign(campaign_id);
      }
    }, (reason) => {
      this.closeResult = this.getDismissReason(reason);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}



