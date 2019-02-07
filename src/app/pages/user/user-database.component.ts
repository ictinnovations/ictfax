import { User } from './user';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

export class UserDatabase {
  dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  get data(): User[] {
    return this.dataChange.value;
  }
  constructor(private aUser: User[]) {
    const userData = aUser.slice();
    this.dataChange.next(userData);
  }
}
