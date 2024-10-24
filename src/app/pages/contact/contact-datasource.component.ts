import { Contact } from './contact';
import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatPaginator } from '@angular/material/paginator';
import { ContactDatabase } from './contact-database.component';

import { Observable, merge } from 'rxjs';

export class ContactDataSource extends DataSource<Contact> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData: Contact[] = [];
  renderedData: Contact[] = [];

  constructor(private contactDatabase: ContactDatabase, private _sort: MatSort,
  private _paginator: MatPaginator) {
    super();

    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  connect(): Observable<Contact[]> {
    const displayDataChanges = [
      this.contactDatabase.dataChange,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange,
    ];
    return merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this.contactDatabase.data.slice().filter((item: Contact) => {
        if (item.first_name == null && item.last_name == null && item.email == null && item.phone == null ) {
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
  getSortedData(data): Contact[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a , b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'contact_id': [propertyA, propertyB] = [a.contact_id, b.contact_id]; break;
        case 'firstName': [propertyA, propertyB] = [a.first_name, b.first_name]; break;
        case 'lastName': [propertyA, propertyB] = [a.last_name, b.last_name]; break;
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