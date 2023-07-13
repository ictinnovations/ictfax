import { Document } from './document';
import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { MatPaginator } from '@angular/material/paginator';
import { DocumentDatabase } from './document-database.component';

import { Observable, merge } from 'rxjs';

export class DocumentDataSource extends DataSource<Document> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData: Document[] = [];
  renderedData: Document[] = [];

  constructor(private documentDatabase: DocumentDatabase, private _sort: MatSort, private _paginator: MatPaginator) {
    super();

    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  connect(): Observable<Document[]> {
    const displayDataChanges = [
      this.documentDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this.documentDatabase.data.slice().filter((item: Document) => {
        let searchStr = (item.name).toLowerCase();
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

  getSortedData(data): Document[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a , b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'ID': [propertyA, propertyB] = [a.document_id, b.document_id]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

}
