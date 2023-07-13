import { Campaign } from './campaign';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatPaginator } from '@angular/material/paginator';
import { CampaignDatabase } from './campaign-database.component';

import { Observable, merge } from 'rxjs';

export class CampaignDataSource extends DataSource<Campaign> {

  constructor(private campaignDatabase: CampaignDatabase, private _sort: MatSort, private _paginator: MatPaginator) {
    super();
  }

  connect(): Observable<Campaign[]> {
    const displayDataChanges = [
      this.campaignDatabase.dataChange,
      this._sort.sortChange,
      this._paginator.page,
    ];
    return merge(...displayDataChanges).map(() => this.getSortedData()).map(data => this.paginate(data));
  }

  disconnect() { }
  getSortedData(): Campaign[] {
    const data = this.campaignDatabase.data.slice();
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a , b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'ID': [propertyA, propertyB] = [a.campaign_id, b.campaign_id]; break;
        case 'ID1': [propertyA, propertyB] = [a.program_id, b.program_id]; break;
        case 'name': [propertyA, propertyB] = [a.program_type, b.program_type]; break;
        case 'total': [propertyA, propertyB] = [a.contact_total, b.contact_total]; break;
        case 'done': [propertyA, propertyB] = [a.contact_done, b.contact_done]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

  paginate(data) {
    const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
    return data.splice(startIndex, this._paginator.pageSize);
  }
}
