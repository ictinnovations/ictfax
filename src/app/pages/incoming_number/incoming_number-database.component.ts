import { IncomingNumber } from './incoming_number';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

export class IncomingNumberDatabase {
  dataChange: BehaviorSubject<IncomingNumber[]> = new BehaviorSubject<IncomingNumber[]>([]);
  get data(): IncomingNumber[] {
    return this.dataChange.value;
  }
  constructor(private aNumber: IncomingNumber[]) {
    const numberData = aNumber.slice();
    this.dataChange.next(numberData);
  }
}
