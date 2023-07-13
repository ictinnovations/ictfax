import { DataSource } from '@angular/cdk/collections';
import { SendFaxDatabase } from './sendfax-database.component';
import { SendFax } from './sendfax';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

export class SendFaxDataSource extends DataSource<SendFax> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData: SendFax[] = [];
  renderedData: SendFax[] = [];

  constructor(private sendfaxDatabase: SendFaxDatabase, private _sort: MatSort, private _paginator: MatPaginator) {
    super();
    
    // this._filterChange.subscribe(() => this._paginator.pageIndex = this._paginator.pageIndex);
  }

  connect(): Observable<SendFax[]> {
    const displayDataChanges = [
      this.sendfaxDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];
    
    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this.sendfaxDatabase.data.slice().filter((item: SendFax) => {
        let searchStr = (item.contact_phone).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });

      // Sort filtered data
      const sortedData = this.getSortedData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    })
  }

  disconnect() { }
  getSortedData(data): SendFax[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a , b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'ID': [propertyA, propertyB] = [a.transmission_id, b.transmission_id]; break;
        case 'phone': [propertyA, propertyB] = [a.contact_phone, b.contact_phone]; break;
        case 'Timestamp': [propertyA, propertyB] = [a.last_run, b.last_run]; break;
        case 'username': [propertyA, propertyB] = [a.username, b.username]; break;
        case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) *
      (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
