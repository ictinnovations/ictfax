import { SendFax } from './sendfax';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

export class SendFaxDatabase {
  dataChange: BehaviorSubject<SendFax[]> = new BehaviorSubject<SendFax[]>([]);
  get data(): SendFax[] {
    return this.dataChange.value;
  }
  constructor(private aSendFax: SendFax[]) {
    const sendFaxData = aSendFax.slice();
    this.dataChange.next(sendFaxData);
  }
}
