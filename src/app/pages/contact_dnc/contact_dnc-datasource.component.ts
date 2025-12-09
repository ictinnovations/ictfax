import { ContactDNC } from './contact_dnc';
import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatPaginator } from '@angular/material/paginator';
import { ContactDNCDatabase } from './contact_dnc-database.component';
import { Observable, merge } from 'rxjs';

export class ContactDNCDataSource extends DataSource<ContactDNC> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData: ContactDNC[] = [];
  renderedData: ContactDNC[] = [];

  constructor(private contact_dncDatabase: ContactDNCDatabase, private _sort: MatSort,
    private _paginator: MatPaginator) {
    super();

    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  connect(): Observable<ContactDNC[]> {
    const displayDataChanges = [
      this.contact_dncDatabase.dataChange,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange,

    ];
    return merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this.contact_dncDatabase.data.slice().filter((item: ContactDNC) => {
        if (item.first_name == null && item.last_name == null && item.email == null && item.phone == null) {
          return;
        }
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
  getSortedData(data): ContactDNC[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'ID': [propertyA, propertyB] = [a.contact_dnc_id, b.contact_dnc_id]; break;
        case 'first_name': [propertyA, propertyB] = [a.first_name, b.first_name]; break;
        case 'last_name': [propertyA, propertyB] = [a.last_name, b.last_name]; break;
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
