import { DID } from './did';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { DIDDatabase } from './did-database.component';

import { Observable, merge } from 'rxjs';

export class DIDDataSource extends DataSource<DID> {

  constructor(private didDatabase: DIDDatabase, private _sort: MatSort,
  private _paginator: MatPaginator) {
    super();
  }

  connect(): Observable<DID[]> {
    const displayDataChanges = [
      this.didDatabase.dataChange,
      this._sort.sortChange,
      this._paginator.page,
    ];
    return Observable.merge(...displayDataChanges)
    .map(() => this.getSortedData())
    .map(data => this.paginate(data));
  }

  disconnect() { }
  getSortedData(): DID[] {
    const data = this.didDatabase.data.slice();
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a , b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'phone': [propertyA, propertyB] = [a.phone, b.phone]; break;
        case 'first_name': [propertyA, propertyB] = [a.first_name, b.first_name]; break;
        case 'assigned_to': [propertyA, propertyB] = [a.assigned_to, b.assigned_to]; break;
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
