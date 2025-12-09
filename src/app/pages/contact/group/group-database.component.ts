import { Group } from './group';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

export class GroupDatabase {
  dataChange: BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([]);
  get data(): Group[] {
    return this.dataChange.value;
  }
  constructor(private aGroup: Group[]) {
    const groupData = aGroup.slice();
    this.dataChange.next(groupData);
  }
}
