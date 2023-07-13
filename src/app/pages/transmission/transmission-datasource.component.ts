import { DataSource } from '@angular/cdk/collections';
import { TransmissionDatabase } from './transmission-database.component';
import { Transmission } from './transmission';
import { MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, merge } from 'rxjs';

export class TransmissionDataSource extends DataSource<Transmission> {

  constructor(private transmissionDatabase: TransmissionDatabase, private _sort: MatSort, private _paginator: MatPaginator) {
    super();
  }

  connect(): Observable<Transmission[]> {
    const displayDataChanges = [
      this.transmissionDatabase.dataChange,
      this._sort.sortChange,
      this._paginator.page,
    ];
    return merge(...displayDataChanges)
    .map(() => this.getSortedData())
    .map(data => this.paginate(data));
  }

  disconnect() { }
  getSortedData(): Transmission[] {
    const data = this.transmissionDatabase.data.slice();
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a , b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'ID': [propertyA, propertyB] = [a.transmission_id, b.transmission_id]; break;
        case 'contact_id': [propertyA, propertyB] = [a.contact_id, b.contact_id]; break;
        case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
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
