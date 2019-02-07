import { Document } from './document';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

export class DocumentDatabase {
  dataChange: BehaviorSubject<Document[]> = new BehaviorSubject<Document[]>([]);
  get data(): Document[] {
    return this.dataChange.value;
  }
  constructor(private aDocument: Document[]) {
    const documentData = aDocument.slice();
    this.dataChange.next(documentData);
  }
}
