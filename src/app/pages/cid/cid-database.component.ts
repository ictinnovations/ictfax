import { CID } from './cid';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

export class CIDDatabase {
  dataChange: BehaviorSubject<CID[]> = new BehaviorSubject<CID[]>([]);
  get data(): CID[] {
    return this.dataChange.value;
  }
  constructor(private aCID: CID[]) {
    const cidData = aCID.slice();
    this.dataChange.next(cidData);
  }
}
