import { Contact } from './contact';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class ContactDatabase {
  dataChange: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
  get data(): Contact[] {
    return this.dataChange.value;
  }
  constructor(aContact: Contact[]) {
    const contactData = aContact.slice();
    this.dataChange.next(contactData);
  }



}
