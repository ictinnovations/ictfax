import { Extension } from './extension';
import { DataSource } from '@angular/cdk/collections';
import { MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ExtensionDatabase } from './extension-database.component';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

import { Observable, merge } from 'rxjs';

export class ExtensionDataSource extends DataSource<Extension> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData: Extension[] = [];
  renderedData: Extension[] = [];

  constructor(private extensionDatabase: ExtensionDatabase, private _sort: MatSort,
  private _paginator: MatPaginator) {
    super();

    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  connect(): Observable<Extension[]> {
    const displayDataChanges = [
      this.extensionDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];
    return merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this.extensionDatabase.data.slice().filter((item: Extension) => {
        let searchStr = (item.first_name + item.last_name + item.email + item.phone).toLowerCase();
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
  getSortedData(data): Extension[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a , b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'ID': [propertyA, propertyB] = [a.account_id, b.account_id]; break;
        case 'username': [propertyA, propertyB] = [a.username, b.username]; break;
        case 'phone': [propertyA, propertyB] = [a.phone, b.phone]; break;
        case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) *
      (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
