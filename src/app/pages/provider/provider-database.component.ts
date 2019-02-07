import { Provider } from './provider';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

export class ProviderDatabase {
  dataChange: BehaviorSubject<Provider[]> = new BehaviorSubject<Provider[]>([]);
  get data(): Provider[] {
    return this.dataChange.value;
  }
  constructor(private aProvider: Provider[]) {
    const providerData = aProvider.slice();
    this.dataChange.next(providerData);
  }
}
