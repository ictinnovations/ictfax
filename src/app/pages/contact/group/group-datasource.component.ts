import { Group } from './group';
import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatPaginator } from '@angular/material';
import { GroupDatabase } from './group-database.component';


import { Observable, merge } from 'rxjs';

export class GroupDataSource extends DataSource<Group> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData: Group[] = [];
  renderedData: Group[] = [];

  constructor(private groupDatabase: GroupDatabase, private _sort: MatSort, private _paginator: MatPaginator) {
    super();

    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  connect(): Observable<Group[]> {
    const displayDataChanges = [
      this.groupDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];

    return merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this.groupDatabase.data.slice().filter((item: Group) => {
        let searchStr = (item.name + item.description).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });

      // Sort filtered data
      const sortedData = this.getSortedData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    })  }

  disconnect() { }
  getSortedData(data): Group[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a , b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'ID': [propertyA, propertyB] = [a.group_id, b.group_id]; break;
        case 'Name': [propertyA, propertyB] = [a.name, b.name]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) *
      (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}

