import { ContactDNC } from './contact_dnc';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class ContactDNCDatabase {
  dataChange: BehaviorSubject<ContactDNC[]> = new BehaviorSubject<ContactDNC[]>([]);
  get data(): ContactDNC[] {
    return this.dataChange.value;
  }
  constructor(aContactDNC: ContactDNC[]) {
    const contact_dncData = aContactDNC.slice();
    this.dataChange.next(contact_dncData);
  }
}
