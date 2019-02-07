import { Transmission } from '../transmission/transmission';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

export class InFaxDatabase {
  dataChange: BehaviorSubject<Transmission[]> = new BehaviorSubject<Transmission[]>([]);
  get data(): Transmission[] {
    return this.dataChange.value;
  }
  constructor(private aInFax: Transmission[]) {
    const infaxData = aInFax.slice();
    this.dataChange.next(infaxData);
  }
}
