import { DID } from './did';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

export class DIDDatabase {
  dataChange: BehaviorSubject<DID[]> = new BehaviorSubject<DID[]>([]);
  get data(): DID[] {
    return this.dataChange.value;
  }
  constructor(private aDID: DID[]) {
    const didData = aDID.slice();
    this.dataChange.next(didData);
  }
}
