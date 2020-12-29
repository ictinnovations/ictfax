import { Campaign } from './campaign';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class CampaignDatabase {
  dataChange: BehaviorSubject<Campaign[]> = new BehaviorSubject<Campaign[]>([]);
  get data(): Campaign[] {
    return this.dataChange.value;
  }
  constructor(private aCampaign: Campaign[]) {
    const campaignData = aCampaign.slice();
    this.dataChange.next(campaignData);
  }
}
