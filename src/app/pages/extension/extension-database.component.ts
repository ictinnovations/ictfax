import { Extension } from './extension';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

export class ExtensionDatabase {
  dataChange: BehaviorSubject<Extension[]> = new BehaviorSubject<Extension[]>([]);
  get data(): Extension[] {
    return this.dataChange.value;
  }
  constructor(private aExtension: Extension[]) {
    const extensionData = aExtension.slice();
    this.dataChange.next(extensionData);
  }
}
