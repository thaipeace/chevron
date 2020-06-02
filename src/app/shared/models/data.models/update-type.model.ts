import {DefaultObject} from '../default/default-object.model';

export class UpdateTypeModel extends DefaultObject {
  name: string;

  constructor(_data = {}) {
    super(_data);
    this.name = this.getValue('Name');
  }
}
