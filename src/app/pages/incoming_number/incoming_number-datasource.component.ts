import { IncomingNumber } from './incoming_number';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatSort, MatPaginator } from '@angular/material';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatSortHeaderIntl } from '@angular/material';
import { IncomingNumberDatabase } from './incoming_number-database.component';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';

export class IncomingNumberDataSource extends DataSource<IncomingNumber> {

  constructor(private incomingNumberDatabase: IncomingNumberDatabase, private _sort: MatSort,
  private _paginator: MatPaginator) {
    super();

  }

  connect(): Observable<IncomingNumber[]> {
    const displayDataChanges = [
      this.incomingNumberDatabase.dataChange,
      this._sort.sortChange,
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges)
    .map(() => this.getSortedData())
    .map(data => this.paginate(data));
  }

  disconnect() { }
  getSortedData(): IncomingNumber[] {
    const data = this.incomingNumberDatabase.data.slice();
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a , b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'phone' : [propertyA, propertyB] = [a.phone, b.phone]; break;
        case 'first_name': [propertyA, propertyB] = [a.first_name, b.first_name]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) *
      (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

  paginate(data) {
    const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
    return data.splice(startIndex, this._paginator.pageSize);
  }
}
