import { Transmission } from './transmission';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

export class TransmissionDatabase {
  dataChange: BehaviorSubject<Transmission[]> = new BehaviorSubject<Transmission[]>([]);
  get data(): Transmission[] {
    return this.dataChange.value;
  }
  constructor(private aTransmission: Transmission[]) {
    const transmissionData = aTransmission.slice();
    this.dataChange.next(transmissionData);
  }
}
