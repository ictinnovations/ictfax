import { IncomingCIDNumber } from './incoming_cid_number';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

export class IncomingCIDNumberDatabase {
  dataChange: BehaviorSubject<IncomingCIDNumber[]> = new BehaviorSubject<IncomingCIDNumber[]>([]);
  get data(): IncomingCIDNumber[] {
    return this.dataChange.value;
  }
  constructor(private aNumber: IncomingCIDNumber[]) {
    const numberData = aNumber.slice();
    this.dataChange.next(numberData);
  }
}
