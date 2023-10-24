import { CID } from './cid';
import { DataSource } from '@angular/cdk/collections';
import {  MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CIDDatabase } from './cid-database.component';

import { Observable } from 'rxjs/Rx';

export class CIDDataSource extends DataSource<CID> {

  constructor(private cidDatabase: CIDDatabase, private _sort: MatSort,
  private _paginator: MatPaginator) {
    super();
  }

  connect(): Observable<CID[]> {
    const displayDataChanges = [
      this.cidDatabase.dataChange,
      this._sort.sortChange,
      this._paginator.page,
    ];
    return Observable.merge(...displayDataChanges)
    .map(() => this.getSortedData())
    .map(data => this.paginate(data));
  }

  disconnect() { }
  getSortedData(): CID[] {
    const data = this.cidDatabase.data.slice();
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a , b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'phone': [propertyA, propertyB] = [a.phone, b.phone]; break;
        case 'first_name': [propertyA, propertyB] = [a.first_name, b.first_name]; break;
        case 'assigned_to': [propertyA, propertyB] = [a.name, b.name]; break;
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
